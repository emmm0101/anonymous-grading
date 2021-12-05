const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser')
const cors = require('cors');
const { json } = require('body-parser');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../db/mindhunter.db'
});

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

test()
const project = sequelize.define('project', {
    projectID: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    name: Sequelize.TEXT,
    link: Sequelize.TEXT
}, {
    freezeTableName: true
});

const user = sequelize.define('user', {
    userID: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    first_name: Sequelize.TEXT,
    last_name: Sequelize.TEXT,
    email: Sequelize.TEXT,
    password: Sequelize.TEXT,
    account_type: Sequelize.TEXT,
    projectID: Sequelize.INTEGER,
}, {
    freezeTableName: true
});


const deliverable = sequelize.define('deliverable', {
    deliverableID: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    ddl_date: Sequelize.TEXT,
    projectID: Sequelize.INTEGER
}, {
    freezeTableName: true
});

const grades_history = sequelize.define('grades_history', {
    grade: Sequelize.REAL,
    deliverableID: Sequelize.INTEGER,
    userID: Sequelize.INTEGER
}, {
    freezeTableName: true
});

deliverable.hasMany(grades_history, { foreignKey: 'deliverableID' });
user.belongsToMany(deliverable, { through: 'grades_history' });
project.hasMany(deliverable, { foreignKey: 'projectID' });
project.hasMany(user, { foreignKey: 'projectID' });


async function checkIfExists() {
    try {
        //await sequelize.drop();
        //console.log('0 tables')
        await user.sync();
        await project.sync();
        await deliverable.sync();
        await grades_history.sync();
    } catch (error) {
        console.error(error.message)
    }
}

checkIfExists();

// async function dropTables(){
//     try{
//     await grades_history.drop();
//     await deliverable.drop();
//     await user_backup.drop();}catch(error){
//         console.error(error.message)
//     }
// }

//dropTables();

const sqlSelect = `Select * from user`;

// user.findAll().then(function (user) {
//     res.json(user);
// }).error(function (err) {
//     console.log("error " + err)
// })

//select using QueryTypes
// sequelize.query("SELECT * FROM `user`", { type: sequelize.QueryTypes.SELECT})
//   .then(function(user) {
//     console.log(user)
//   })

//show tables
sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
    console.log('// Tables in database', '==========================');
    console.log(tableObj);
}).catch((err) => {
    console.log('showAllSchemas ERROR', err);
})

const app = express()
app.use(cors())
app.use(bodyParser.json());



app.get('/users', async (req, res) => {
    try {
        let users = await user.findAll({
            //attributes: ['userID', 'first_name', 'last_name', 'email', 'password', 'account_type', 'projectID']
        })
        res.status(200).json(users)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});


app.post('/users', async (req, res) => {
    try {
        if (req.query.bulk && req.query.bulk == 'on') {
            await user.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        }
        else {
            await user.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/usersID', async (req, res) => {
    try {
        let getUser = await user.findAll({
                where: {
                    userID: 3  //req.params.userID 
                }
            })
        // let getUser = user.findOne({ where: {userID: 3} })
        if (getUser) {
            res.status(200).json(getUser)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})



app.delete('/deleteUser', async (req, res) => {
	try{
		let getUser = await user.findOne({ userID : 5})
		if (getUser){
			await getUser.destroy().then(function() {res.status(202).json({message : 'accepted'})})
            console.log('user deleted');
		}
		else{
			res.status(404).json({message : 'not found'})
		}
	}
	catch(e){
		console.warn(e)
		res.status(500).json({message : 'server error'})
	}
})

app.get('/projects', async (req, res) => {
    try {
        let projects = await project.findAll()
        res.status(200).json(projects)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});


app.post('/projects', async (req, res) => {
    try {
        if (req.query.bulk && req.query.bulk == 'on') {
            await project.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        }
        else {
            await project.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/projectID', async (req, res) => {
    try {
        let getProject = await project.findAll({
                where: {
                    projectID: 2  //req.params.userID 
                }
            })
        // let getUser = user.findOne({ where: {userID: 3} })
        if (getProject) {
            res.status(200).json(getProject)
        }
        else {
            res.status(404).json({ message: 'not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})



app.delete('/deleteProject', async (req, res) => {
	try{
		let getProject = await project.findOne({ userID : 5})
		if (getProject){
			await getProject.destroy().then(function() {res.status(202).json({message : 'accepted'})})
            console.log('project deleted');
		}
		else{
			res.status(404).json({message : 'not found'})
		}
	}
	catch(e){
		console.warn(e)
		res.status(500).json({message : 'server error'})
	}
})

app.listen(8080)

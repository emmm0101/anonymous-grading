const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser')
//const cors = require('cors');

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

const Project = sequelize.define('project', {
    projectID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: Sequelize.TEXT,
    link: Sequelize.TEXT
}, {
    freezeTableName: true
});

const User = sequelize.define('user', {
    userID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
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

const Deliverable = sequelize.define('deliverable', {
    deliverableID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ddl_date: Sequelize.TEXT,
    projectID: Sequelize.INTEGER
}, {
    freezeTableName: true
});

const Grades_history = sequelize.define('grades_history', {
    grade: Sequelize.REAL,
    deliverableID: Sequelize.INTEGER,
    userID: Sequelize.INTEGER
}, {
    freezeTableName: true
});

Deliverable.hasMany(Grades_history, { foreignKey: 'deliverableID' });
User.belongsToMany(Deliverable, { through: 'grades_history' });
Project.hasMany(Deliverable, { foreignKey: 'projectID' });
Project.hasMany(User, { foreignKey: 'projectID' });

async function checkIfExists() {
    try {
        await User.sync({ force: true });
        await Project.sync({ force: true });
        await Deliverable.sync({ force: true });
        await Grades_history.sync({ force: true });
    } catch (error) {
        console.error(error.message)
    }
}

//checkIfExists();

{
    // async function dropTables(){
    //     try{
    //         await grades_history.drop();
    //         await deliverable.drop();
    //         await user_backup.drop();}
    //     catch(error){
    //         console.error(error.message)
    //     }
}

//dropTables();

{//select using QueryTypes
    // sequelize.query("SELECT * FROM `user`", { type: sequelize.QueryTypes.SELECT})
    //   .then(function(user) {
    //     console.log(user)
    //   })
}

{
    //show tables
    // sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
    //     console.log('// Tables in database', '==========================');
    //     console.log(tableObj);
    // }).catch((err) => {
    //     console.log('showAllSchemas ERROR', err);
    // })
}

const app = express()
//app.use(cors())
app.use(bodyParser.json());

//user
app.get('/users', async (req, res) => {
    try {
        let users = await User.findAll({
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
            await User.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        }
        else {
            await User.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        let user = await User.findByPk(req.params.id)
        // let getUser = user.findOne({ where: {userID: 3} })
        if (user) {
            res.status(200).json(user)
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

app.put('/users/:id', async (req, res) => {
	try{
		let user = await User.findByPk(req.params.id)
		if (user){
			await user.update(req.body)
			res.status(202).json({message : 'accepted'})
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

app.delete('/users/:id', async (req, res) => {
    try {
        let user = await User.findByPk(req.params.id)
        //.findOne({ userID: 5 })
        if (user) {
            await user.destroy()
            res.status(202).json({ message: 'accepted' })
            console.log('user deleted');
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

//project
app.get('/projects', async (req, res) => {
    try {
        let projects = await Project.findAll({
        })
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
            await Project.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        }
        else {
            await Project.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/projects/:id', async (req, res) => {
    try {
        let project = await Project.findByPk(req.params.id)
        // let getUser = user.findOne({ where: {userID: 3} })
        if (project) {
            res.status(200).json(project)
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

app.put('/projects/:id', async (req, res) => {
	try{
		let project = await Project.findByPk(req.params.id)
		if (project){
			await project.update(req.body)
			res.status(202).json({message : 'accepted'})
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

app.delete('/projects/:id', async (req, res) => {
    try {
        let project = await Project.findByPk(req.params.id)
        if (project) {
            await project.destroy()
            res.status(202).json({ message: 'accepted' })
            console.log('user deleted');
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

//deliverable
app.get('/deliverables', async (req, res) => {
    try {
        let deliverables = await Deliverable.findAll()
        res.status(200).json(deliverables)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});

app.post('/deliverables', async (req, res) => {
    try {
        if (req.query.bulk && req.query.bulk == 'on') {
            await Deliverable.bulkCreate(req.body)
            res.status(201).json({ message: 'created' })
        }
        else {
            await Deliverable.create(req.body)
            res.status(201).json({ message: 'created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/deliverables/:id', async (req, res) => {
    try {
        let deliverable = await Deliverable.findByPk(req.params.id)
        if (deliverable) {
            res.status(200).json(deliverable)
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

app.put('/deliverables/:id', async (req, res) => {
	try{
		let deliverable = await Deliverable.findByPk(req.params.id)
		if (deliverable){
			await deliverable.update(req.body)
			res.status(202).json({message : 'accepted'})
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

app.delete('/deliverables/:id', async (req, res) => {
    try {
        let deliverable = await Deliverable.findByPk(req.params.id)
        if (deliverable) {
            await deliverable.destroy()
            res.status(202).json({ message: 'accepted' })
            console.log('deliverable deleted');
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


app.listen(8080)

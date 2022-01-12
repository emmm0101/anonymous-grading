const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser')
const cors = require('cors');
const path = require('path')
const { sign } = require('jsonwebtoken')
const { validateToken } = require('./middlewares/AuthMiddleware')

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
    link: Sequelize.TEXT,
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
    projectID: Sequelize.INTEGER,
    description: Sequelize.TEXT
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

//{
    // async function dropTables(){
    //     try{
    //         await grades_history.drop();
    //         await deliverable.drop();
    //         await user_backup.drop();}
    //     catch(error){
    //         console.error(error.message)
    //     }
//}

//dropTables();

//{//select using QueryTypes
    // sequelize.query("SELECT * FROM `user`", { type: sequelize.QueryTypes.SELECT})
    //   .then(function(user) {
    //     console.log(user)
    //   })
//}

//{
    //show tables
    // sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
    //     console.log('// Tables in database', '==========================');
    //     console.log(tableObj);
    // }).catch((err) => {
    //     console.log('showAllSchemas ERROR', err);
    // })
//}

const app = express()
// app.use(express.static(path.join(_dirname, 'public')))
app.use(cors()) //node module for allowing data transfer from frontend to backend
app.use(express.json());

//user
app.get('/users', async (req, res) => {
    console.time('time')
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
    console.timeEnd('time')
});

app.post('/registration', async (req, res) => {
    try {
        let account_type = req.body.email.split('@')
        account_type = account_type[1].split('.')
        if (account_type[0] == 'stud') {
            req.body.account_type = 'Student'
        } else {
            req.body.account_type = 'Teacher'
        }
        await User.create(req.body)
        const accessToken = sign({email: req.body.email}, "securedID");
        console.log(accessToken)
        res.json({ token: accessToken, email: req.body.email, });
        res.status(201).json({ message: 'Registered successfully!' })
        res.send(accessToken);
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
    try {
        let user = await User.findByPk(req.params.id)
        if (user) {
            await user.update(req.body)
            res.status(202).json({ message: 'accepted' })
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


app.get('/projects/:id', validateToken, async (req, res) => {
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
    try {
        let project = await Project.findByPk(req.params.id)
        if (project) {
            await project.update(req.body)
            res.status(202).json({ message: 'accepted' })
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
    try {
        let deliverable = await Deliverable.findByPk(req.params.id)
        if (deliverable) {
            await deliverable.update(req.body)
            res.status(202).json({ message: 'accepted' })
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

app.post('/register', async (req, res) => {
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let email = req.body.email
    let password = req.body.password

    //verficare email => setare tip cont
    // try {
    //     await Project.create(req.body)
    //     res.status(201).json({ message: 'created' })

    // }
    // catch (e) {
    //     console.warn(e)
    //     res.status(500).json({ message: 'server error' })
    // }
})

app.post('/login', async (req, res) => {
    try {
        let email = req.body.email
        let password = req.body.password
        let user = await User.findOne({
            where: {
                email: email,
            }
        })
        if (user && user.password == password) {
            console.log('login successful');
            console.log(user);

            const accessToken = sign({email: user.email}, "securedID");
            console.log(accessToken)
            res.json({ token: accessToken, email: email});
        }
        else if (user) {
            res.status(404).json({ msg: 'email and password do not match' })
        }
        else {
            res.status(404).json({ msg: 'user does not exist' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }

})

// inregistrare proiect (carousel) -> post project + deliv -> message in front: completed -> put user
//part1
// 1. nume proiect
// 2. link
// 3. introducere coechipieri  // projectId(where name == name) && put(/users/:projectId) { where() }
//part2
// 1. inregistrare deliverables 


app.get("/auth", validateToken, (req, res) => {
    res.json('user has been authentificated');
   //console.log(req.user)
  });

app.post('/registerProject', async (req, res) => {
    try {
        await Project.create(req.body)
        res.status(201).json({ message: 'created' })

    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/users/project/:projectID', async (req, res) => {
    let users = req.body
    console.log(users);
    try
    {
        for (let element of users) {
            let user = await User.findOne({
                where: {
                    first_name: element.first_name,
                    last_name: element.last_name,
                }
            })
            console.log(user);
            if (user) {
                await user.update({ projectID: req.params.projectID })
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'not found' })
            }
        }
    }
    catch(e){
        console.error(e.message);
    }
})



app.listen(3001)

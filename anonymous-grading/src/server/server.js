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
    const id = req.header("deliverableID")
    try {
        console.log(id)
        let deliverable = await Deliverable.findOne({
            where: {
                deliverableID: id
            }
        })
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
            res.json({ token: accessToken, email: email, userID: user.userID});
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


app.get("/auth", validateToken, (req, res) => {
    res.json('user has been authentificated');
   //console.log(req.user)
  });

app.post('/registerProject', async (req, res) => {
    try {
       const project = await Project.create(req.body)
        res.status(201).json({ message: 'created', projectID: project.projectID })

    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.put('/users/project/:projectID', async (req, res) => {
    let data = req.body
    console.log(data)
    try{
            let user1 = await User.findOne({
                where: {
                    email: data.user_1
                }
            })
            console.log(user1);
            if (user1) {
                await user1.update({ projectID: data.projectID })
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'user 1 not found' })
            }
        }catch(e){
            console.error(e.message);
    }

    try{
        let user2 = await User.findOne({
            where: {
                email: data.user_2
            }
        })
        console.log(user2);
        if (user2) {
            await user2.update({ projectID: data.projectID })
            res.status(202).json({ message: 'accepted' })
        }
        else {
            res.status(404).json({ message: 'user 2 not found' })
        }
    }catch(e){
        console.error(e.message);
    }

    try{
        let user3 = await User.findOne({
            where: {
                email: data.user_3
            }
        })
        console.log(user3);
        if (user3) {
            await user3.update({ projectID: data.projectID })
            res.status(202).json({ message: 'accepted' })
        }
        else {
            res.status(404).json({ message: 'user 3 not found' })
        }
    }catch(e){
        console.error(e.message);
    }
})

app.post('/registerDeliverables', async (req, res) => {
    let deliverables = req.body;
    try
    {
        for (var i = 0; i <3 ;i++) {
            await Deliverable.create(deliverables[i])
            res.status(201).json({ message: 'deliverable created' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/user/project/:id', async (req, res) => {
    const id = req.header("userID")
    try {
        console.log("id " + id)
        let user = await User.findOne({
            where: {
                userID: id
            }
        })
        let project = await Project.findOne({
            where: {
                projectID: user.projectID
            }
        })
        console.log(user)
        if (project) {
            res.status(200).json(project)
        }
        else {
            res.status(404).json({ message: 'project not found' })
        }
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
})

app.get('/teammates', async (req, res) => {
    const id = req.header("projectID")
    try {
        let users = await User.findAll({where: {
            projectID: id
        }})
        res.status(200).json(users)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});

app.get('/usersDeliverables', async (req, res) => {
    const id = req.header("projectID")
    try {
        let deliverables = await Deliverable.findAll({where: {
            projectID: id
        }})
        res.status(200).json(deliverables)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});

app.get('/evaluateProject', async (req, res) => {
    const id = req.header("deliverableID")
    try {
        console.log(id)
        let deliverable = await Deliverable.findOne({
            where: {
                deliverableID: id
            }
        })
        if (deliverable) {
            let project = await Project.findOne({
                where: {
                    projectID: deliverable.projectID
                }
            })
            let dataToSend = [];
            dataToSend.push(deliverable);
            dataToSend.push(project);
            res.status(200).json(dataToSend)
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

app.post('/assignRandomEvaluator', async (req, res) => {
    try {
        console.log(req.body)
       const grade_history = await Grades_history.create(req.body)
        res.status(201).json({ message: 'created', deliverableID: grade_history.deliverableID })

    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});

app.listen(3001)

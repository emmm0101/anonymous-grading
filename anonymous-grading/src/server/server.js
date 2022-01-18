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
    userID: Sequelize.INTEGER,
    projectID: Sequelize.INTEGER
}, {
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
});

Deliverable.hasMany(Grades_history, { foreignKey: 'deliverableID' });
User.belongsToMany(Deliverable, { through: 'grades_history' });
Project.hasMany(Deliverable, { foreignKey: 'projectID' });
Project.hasMany(User, { foreignKey: 'projectID' });

async function checkIfExists() {
    try {
        await Grades_history.sync({ force: true });
    } catch (error) {
        console.error(error.message)
    }
}


const app = express()
app.use(cors()) //node module for allowing data transfer from frontend to backend
app.use(express.json());


//user -> select all from user -> returneaza toate inregistrarile din tabela user
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


//insert in tabela user -> in functie de email se va verifica daca se creeaza cont de student sau de profesor
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


// select from user where id = `${id}` => gaseste user ul pe baza primary key-ului
app.get('/users/:id', async (req, res) => {
    try {
        let user = await User.findByPk(req.params.id)
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


//select from user where id = `${id}` => gaseste user ul pe baza primary key-ului pentru a-i putea face update cu datele primite
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


//sterge inregistrarea din tabela user care are primary key-ul = valoarea primita in request
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
//select * prom projects -> intoarce toate inregistrarile din tabela
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


//creeaza multiple inregistrari pe baza datelor primite in request
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


//realizeaza un select in tabela project unde id-l este egal cu id-ul trimis ca parametru in request
app.get('/projects/:id', async (req, res) => {
    try {
        let project = await Project.findByPk(req.params.id)
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


//realizeaza un select in tabela project unde id-l este egal cu id-ul trimis ca parametru in request, pentru ca  apoi sa faca update inregistrarii cu restul datelor trimise tot ca parametru
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


//sterge inregistrarea din tabela project pe baza primary key-ului
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
//select * from deliverables -> intoarce toate inreg din deliverables(partialele)
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

//creeaza multiple inregistrari pe baza datelor primite in request
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


//realizeaza un select in tabela deliverables unde id-l este egal cu id-ul trimis ca parametru in request
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


//pe baza id-ului primit din header-ul request-ului, se gaseste partialul pentru a-i fi gasit orojectID-ul corespunzator
app.get('/getProjectIdFromDeliverable', async (req, res) => {
    const id = req.header("deliverableID")
    try {
        console.log("id from getProject" + id)
        let deliverable = await Deliverable.findOne({
            where: {
                deliverableID: id
            }
        })
        if (deliverable) {
            res.status(200).json(deliverable.projectID)
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


//realizeaza un select in tabela deliverables unde id-ul este egal cu id-ul trimis ca parametru in request, pentru ca  apoi sa se faca update inregistrarii cu restul datelor trimise tot ca parametru
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


//stergere inregistrare din tabela deliverables pe baza cheii
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


//cauta in baza de date user-ul care era email-ul la fel cu cel trimis in request, iar daca si parola corespunde, inseamna ca inregistrarea exista in baza de date, deci este un user
//valid. Prin urmare, prin metoda sign din jwt se semneaza token-ul care va fi retinut in frontend, in localStorage, pentru a autoriza user-ul.
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
            res.json({ token: accessToken, email: email, userID: user.userID, account_type: user.account_type});
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


//cu ajutorul metodei validateToken din AuthMiddleware, se va face verificarea token-ului pentru a determina daca user-ul poate accesa sau nu functionalitatile
app.get("/auth", validateToken, (req, res) => {
    res.json('user has been authentificated');
   //console.log(req.user)
  });


//creeaza o inregistrare in tabela project cu datele trimise in request
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


//pe baza datelor trimise in body-ul request-ului, se identifica userii care vor avea acelasi proiect si se va face update pe coloana projectID, cu id-ul corespunzator proiectului,
//trimis tot in body0ul request-ului ca prim parametru
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


//pentru fiecare element trimis ca parametru in body, se va face un insert in tabela deliverables cu datele acestora
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


//pe baza id-ul din header-ul request-ului, se va cauta prima data user-ul care are acelasi id cu cel primit pentru a putea prelua project id-ul din coloana projectID, din
//tabela user, ca mai apoi sa se faca un select prin care preluam proiectul efectiv pentru a putea fi trimis catre frontend
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


//cauta in tabela user toti studentii care au la projectID acelasi id ca cel primit in header-ul request-ului
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


//pe baza projectID-ului primit in header-ul request-ului, se vor identifica deliverables(partialele) corespunzatoare projectID-ului pentru a putea fi trimise inapoi
//catre frontend
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


//pe bazaid-ului din header-ul request-ului, se identifica partialul,urmand ca prin acesta sa identificam proiectul din care face parte partialul respectiv
//aceste request-uri sunt necesare pentru a avea acces la numele proiectului, link-ul catre repository, deadline-ul partialului, dar si descrierea acestuia
app.get('/evaluateProject', async (req, res) => {
    const id = req.header("deliverableID")
    try {
        // console.log(id)
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


//reuqest de insert in tabela grades_history, prin care se asigneaza un student random sa evalueze partialul respectiv
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


//request pentru a face update pe coloana grade din tabela grades_history cu nota trimisa de catre utilizator
app.put('/updateGrade', async (req, res) => {
    let data = req.body
    // console.log(data)
    try{
            let grade = await Grades_history.findOne({
                where: {
                    deliverableID: data.deliverableID
                }
            })
            console.log(grade);
            if (grade) {
                await grade.update({ grade: data.grade })
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'deliverable not found' })
            }
        }catch(e){
            console.error(e.message);
    }
})


//request pentru a face update pe coloana projectID din tabela grades_history cu projectID-ul preluat din body-ul request-ului (id preluand din frontend din localStorage)
app.put('/updateProjectID', async (req, res) => {
    let data = req.body
    console.log(data)
    try{
            let grade = await Grades_history.findOne({
                where: {
                    deliverableID: data.deliverableID
                }
            })
            console.log(grade);
            if (grade) {
                await grade.update({ projectID: data.projectToEvaluate })
                res.status(202).json({ message: 'accepted' })
            }
            else {
                res.status(404).json({ message: 'deliverable not found' })
            }
        }catch(e){
            console.error(e.message);
    }

})


//select * from grades_history -> returneaza toate inregistrarile din tabela grades_history
app.get('/grades', async (req, res) => {
    try {
        let grades = await Grades_history.findAll()
        res.status(200).json(grades)
    }
    catch (e) {
        console.warn(e)
        res.status(500).json({ message: 'server error' })
    }
});


//request  de preluare a tuturor notelor pe baza id-ului proiectului
app.get('/gradesForProject', async (req, res) => {
    const id = req.body.projectID
    try {
        console.log("id" + id)
        let grades = await Grades_history.findAll({
            where: {
                projectID: id
            }
        })
        if (grades) {
            res.status(200).json(grades)
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



app.listen(3001)

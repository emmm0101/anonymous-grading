const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mindhunter.db'
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
    underscored: true,
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
    underscored: true,
    freezeTableName: true
});


const deliverable = sequelize.define('deliverable', {
    deliverableID: {
        type: Sequelize.UUID,
        primaryKey: true
    },
    ddl_date: Sequelize.TEXT,
}, {
    underscored: true,
    freezeTableName: true
});

const member = sequelize.define('member', {
    grade: Sequelize.REAL,
}, {
    underscored: true,
    freezeTableName: true
});

member.hasMany(deliverable, { foreignKey: 'deliverableID'});
deliverable.belongsTo(member);
member.hasOne(user, { foreignKey: 'usedID' });
user.belongsTo(member);
deliverable.hasOne(project, { foreignKey: 'projectID' });
project.belongsTo(deliverable);
user.hasOne(project, { foreignKey: 'projectID' });
project.belongsTo(user);

async function checkIfExists() {
    await user.sync();
    await project.sync();
    await deliverable.sync();
    await member.sync();
}

checkIfExists();

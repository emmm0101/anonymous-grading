const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mindhunter.db'
  });

// const db  = new sqlite3.Database("./mindhunter.db", sqlite3.OPEN_READWRITE, (err) => {
//     if(err) return console.error(err.message);

//     console.log("connection was succesful");
// });


const sqlSelect = `SELECT * FROM project`;

// sequelize.all(sqlSelect, [], (err, rows) => {
//     if(err) return console.error(err.message);

//     rows.forEach((row) => {
//         console.log(row);
//     })
// })

// sequelize.close((err) => {
//     if(err) return console.error(err.message);
// });

return sequelize.query(sqlSelect, {
    type:sequelize.QueryTypes.SELECT
  })
const mysql = require('mysql');


const connection = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: "",
    database: "doctors_booking"
})


connection.connect((err) => {
    if (err) throw err;
    console.log(`Database connection successful`);
})

module.exports = connection;
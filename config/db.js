const mysql = require('mysql');
const dbConfig = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

connection.on('error', (err) => {
    console.error('MySQL connection error:', err);
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});

process.on('SIGINT', () => {
    connection.end();
    process.exit();
});

module.exports = pool;
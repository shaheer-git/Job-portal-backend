const express = require('express');
const route = express.Router();
const pool = require('../config/db');
const sqlQueries = require('../config/sqlQueries');

route.use(express.json());

// get employer details 
route.get('/', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.getEmpolyerDetails;

        connection.query(query, (queryErr, results) => {

            connection.release();

            if (queryErr) {
                console.error('Error fetching job posts:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            console.log('Job posts fetched successfully');
            res.json({status: "success", result: results});
        });
    });
});

module.exports = route;
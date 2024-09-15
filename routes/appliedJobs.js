const express = require('express');
const route = express.Router();
const pool = require('../config/db');
const sqlQueries = require('../config/sqlQueries');

route.use(express.json());

// get all job posts 
route.get('/get-all-applied-jobs', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.getAllAppliedJobs;

        connection.query(query, (queryErr, results) => {

            connection.release();

            if (queryErr) {
                console.error('Error fetching applied jobs:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            console.log('Applied jobs fetched successfully');
            res.json({ status: "success", result: results });
        });
    });
});

route.get('/get-applied-jobs/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getAppliedJobs;

        connection.query(query, [candidateId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidates fetched successfully');
            res.json({ status: "success", result: results });
        });
    });
});

route.get('/getAppliedCandidateDetails', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getCandidateDetails;

        connection.query(query, (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates details:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidates details fetched successfully');
            res.json({ status: "success", result: results });
        });
    });
});

route.get('/get-resume/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const query = sqlQueries.getResume;
        connection.query(query, [candidateId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Resume fetched successfully');
            res.json({ status: "success", result: results });
        });
    });
})


module.exports = route;
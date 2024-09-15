const express = require('express');
const route = express.Router();
const pool = require('../config/db');
const sqlQueries = require('../config/sqlQueries');
const cors = require('cors')
// const multer = require('multer');
// const upload = multer();

route.use(express.json());
route.use(cors());

// Create candidate profile
// route.post('/create-candidate', (req, res) => {
//     const candidateData = req.body;
    
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting connection from pool:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const query = sqlQueries.createCandidate;

//         const values = [
//             candidateData.first_name, candidateData.mobile_number, candidateData.date_of_birth,
//             candidateData.gender, candidateData.address, candidateData.Level_of_education,
//             candidateData.College_name, candidateData.Degree, candidateData.Specialization,
//             candidateData.Start_date, candidateData.End_date, candidateData.Language,
//             candidateData.Prepared_work_type, candidateData.Search_by_job_title,
//             candidateData.Suggested_job_title, candidateData.Email_ID
//         ];

//         connection.query(query, values, (queryErr, results) => {
//             connection.release();

//             if (queryErr) {
//                 console.error('Error creating candidate:', queryErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             console.log('Candidate created successfully');
//             res.json({ status: 'success', message: 'Candidate created successfully' });
//         });
//     });
// });
// --------------------working above code


// route.post('/create-candidate', upload.single('Candidate_Resume'), (req, res) => {
//     const candidateData = req.body;
    
//     pool.getConnection((err, connection) => {
//         if (err) {
//             console.error('Error getting connection from pool:', err);
//             return res.status(500).json({ error: 'Internal Server Error' });
//         }

//         const query = sqlQueries.createCandidate;

//         const values = [
//             candidateData.first_name, candidateData.mobile_number, candidateData.date_of_birth,
//             candidateData.gender, candidateData.address, candidateData.Level_of_education,
//             candidateData.College_name, candidateData.Degree, candidateData.Specialization,
//             candidateData.Start_date, candidateData.End_date, candidateData.Language,
//             candidateData.Prepared_work_type, candidateData.Search_by_job_title,
//             candidateData.Suggested_job_title, candidateData.Email_ID,
//             req.file ? req.file.buffer : null
//         ];
//         console.log(req.file);
//         connection.query(query, values, (queryErr, results) => {
//             connection.release();

//             if (queryErr) {
//                 console.error('Error creating candidate:', queryErr);
//                 return res.status(500).json({ error: 'Internal Server Error' });
//             }

//             console.log('Candidate created successfully');
//             res.json({ status: 'success', message: 'Candidate created successfully' });
//         });
//     });
// });

const multer = require('multer');

// Define storage for the uploaded files
const storage = multer.memoryStorage(); // Store files in memory

// Filter for allowed file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Accept only PDF and DOCX files
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
};

// Initialize multer with the storage and file filter
const upload = multer({ storage, fileFilter });

// Route to handle creating a candidate with resume upload
route.post('/create-candidate', upload.single('Candidate_Resume'), (req, res) => {
    const candidateData = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.createCandidate;
        console.log(req.file)

        const values = [
            candidateData.first_name, candidateData.mobile_number, candidateData.date_of_birth,
            candidateData.gender, candidateData.address, candidateData.Level_of_education,
            candidateData.College_name, candidateData.Degree, candidateData.Specialization,
            candidateData.Start_date, candidateData.End_date, candidateData.Language,
            candidateData.Prepared_work_type, candidateData.Search_by_job_title,
            candidateData.Suggested_job_title, 
            req.file ? req.file.buffer : null, // Use req.file.buffer to access the file content
            candidateData.Email_ID
        ];
        debugger;
        console.log(req.file)

        connection.query(query, values, (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error creating candidate:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidate created successfully');
            res.json({ status: 'success', message: 'Candidate created successfully' });
        });
    });
});


route.get('/get-all-candidates', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getAllCandidates;

        connection.query(query, (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidates fetched successfully');
            res.json({status: "success", result: results});
        });
    });
});

//update candidate registration
route.put('/update-candidate/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.updateCandidateById;

        connection.query(query, [updatedCandidateData, candidateId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error updating candidate:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Candidate not found' });
            }

            console.log(`Candidate with ID ${candidateId} updated successfully`);
            res.json({status: 'success', message: 'Candidate updated successfully' });
        });
    });
});

// Delete candidate registration
route.delete('/delete-candidate/:candidateId', (req, res) => {
    const candidateId = req.params.candidateId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.deleteCandidateById;

        connection.query(query, [candidateId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error deleting candidate:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: 'Candidate not found' });
            }

            console.log(`Candidate with ID ${candidateId} deleted successfully`);
            res.json({ status: 'success', message: 'Candidate deleted successfully' });
        });
    });
});

route.get('/getEmailID/:id', (req, res) => {
    const Email_ID = req.params.id;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getEmailID;

        connection.query(query, [Email_ID], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidates fetched successfully');
            res.json({status: "success", result: results});
        });
    });
});

route.get('/getMobileNum/:num', (req, res) => {
    const number = req.params.num;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getMobNum;

        connection.query(query, [number], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidates fetched successfully');
            res.json({status: "success", result: results});
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
            res.json({status: "success", result: results});
        });
    });
});

route.get('/get-candidate-id/:name', (req, res) => {
    const candidateName = req.params.name;
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const query = sqlQueries.getCandidateID;

        connection.query(query, [candidateName], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching candidates:', queryErr);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            console.log('Candidate ID fetched successfully');
            res.json({status: "success", result: results});
        });
    });
});



module.exports = route;
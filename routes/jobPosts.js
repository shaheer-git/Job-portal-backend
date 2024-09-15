const express = require('express');
const route = express.Router();
const pool = require('../config/db');
const sqlQueries = require('../config/sqlQueries');

route.use(express.json());

// get all job posts 
route.get('/get-all-job-posts', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.getAlljobPosts;

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

// get jobs based on job title
route.get('/get-job-posts-by-title/:jobTitle', (req, res) => {
    const jobTitle = req.params.jobTitle;
    // const jobTitle = "Software Engineer";

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.getJobPostByTitle;
        const values = [jobTitle];

        connection.query(query, values, (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error fetching job posts:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            console.log(`Job posts for title '${jobTitle}' fetched successfully`);
            res.json({status: "success", result: results});
        });
    });
});

// create a job post
route.post('/create-job-post', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }
        console.log(req.body)
        const { job_title, special_note, job_description, quantity, state, city, company_name, salary_package, job_facilities, level_of_education, job_experience,  key_skills, about_company, industry_type, job_requirement, c_name} = req.body;
        console.log(c_name)
        if (!job_title || !special_note || !job_description || !state || !job_experience || !company_name || !salary_package || !job_facilities || !level_of_education || !key_skills || !about_company || !industry_type || !job_requirement || !city || !quantity || !c_name ) {
            return res.status(400).json({ status: "failed", error: 'All fields are required' });
        }

        const query = sqlQueries.createJobPost;

        connection.query(query, [job_title, job_description, 1, 0, job_experience, company_name, salary_package, job_facilities, level_of_education, key_skills, about_company, industry_type, special_note, job_requirement, state, city, quantity, c_name], (err, result) => {
            if (err) {
                console.error('Error creating job post:', err);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            console.log('Job post created successfully');
            res.json({ status: "success", message: 'Job post created successfully', jobId: result.insertId });
        })
    })
});

// update a job post by id
route.put('/update-job-post/:postId', (req, res) => {
    const postId = req.params.postId;
    const updatedJobPost = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.updateJobPostById;

        connection.query(query, [updatedJobPost, postId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error updating job post:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            if (results.affectedRows === 0) {
                // If no rows were affected, the job post with the specified ID was not found
                return res.status(404).json({ status: "failed", error: 'Job post not found' });
            }

            console.log(`Job post with ID ${postId} updated successfully`);
            res.json({ status: "success", message: 'Job post updated successfully' });
        });
    });
});

//SOFT deletes the job post
route.put('/softDelete-job-post/:postId', (req, res) => {
    const postId = req.params.postId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.softDeleteJobPostById;

        connection.query(query, [postId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error updating job post:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            if (results.affectedRows === 0) {
                // If no rows were affected, the job post with the specified ID was not found
                return res.status(404).json({ status: "failed", error: 'Job post not found' });
            }

            console.log(`Job post with ID ${postId} updated successfully`);
            res.json({ status: "success", message: 'Job post updated successfully' });
        });
    });
});

// deleting the job post by id
route.delete('/delete-job-post/:postId', (req, res) => {
    const postId = req.params.postId;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }

        const query = sqlQueries.deleteJobPostById;

        connection.query(query, [postId], (queryErr, results) => {
            connection.release();

            if (queryErr) {
                console.error('Error deleting job post:', queryErr);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }

            if (results.affectedRows === 0) {
                // If no rows were affected, the job post with the specified ID was not found
                return res.status(404).json({ status: "failed", error: 'Job post not found' });
            }

            console.log(`Job post with ID ${postId} deleted successfully`);
            res.json({ status: "success", message: 'Job post deleted successfully' });
        });
    });
});

// apply for a job post
route.post('/apply-job-post',(req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
        }
        console.log(req.body)
        const { job_id, candidate_id } = req.body;
        if (!job_id, !candidate_id ) {
            return res.status(400).json({ status: "failed", error: 'All fields are required' });
        }

        const query = sqlQueries.applyJobPost;
        connection.query(sqlQueries.setForeinKeyDisable);
        connection.query(query, [job_id, candidate_id], (err, result) => {
            if (err) {
                console.error('Error applying job post:', err);
                return res.status(500).json({ status: "failed", error: 'Internal Server Error' });
            }
            res.json({ status: "success", message: 'Applied Job post successfully'});
        })
        connection.query(sqlQueries.setForeinKeyEnable);
    })
})

module.exports = route;
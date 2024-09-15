module.exports = {
    //------- Foreign key enable disable -----------
    setForeinKeyEnable: 'SET foreign_key_checks = 1',
    setForeinKeyDisable: 'SET foreign_key_checks = 0',
    getAlljobPosts: 'SELECT * FROM job_post',
    getJobPostByTitle: 'SELECT * FROM job_post WHERE job_title = CONVERT(? USING utf8mb3)',
    createJobPost: 'INSERT INTO job_post (job_title, job_description, company_id, status, created_on, updated_on, job_experience, company_name, salary_package, job_facilities, level_of_education, key_skills, about_company, industry_type, special_note, job_requirement, state, city, quantity, c_name) VALUES (?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    updateJobPostById: 'UPDATE job_post SET ? WHERE id = ?',
    deleteJobPostById: 'DELETE FROM job_post WHERE id = ?',
    softDeleteJobPostById: 'UPDATE job_post SET status = 1 WHERE id = ?',
    applyJobPost: 'INSERT INTO job_apply (job_id, candidate_id) VALUES (?, ?)',
    // ----- candidate registration-------
    // createCandidate: 'INSERT INTO candidate_register SET ?',
    createCandidate: 'INSERT INTO candidate_register( first_name, mobile_number, date_of_birth, gender, address, Level_of_education, College_name, Degree, Specialization, Start_date, End_date, Language, Prepared_work_type, Search_by_job_title, Suggested_job_title, Candidate_Resume, Email_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    getAllCandidates: 'SELECT * FROM candidate_register',
    updateCandidateById: 'UPDATE candidate_register SET ? WHERE id = ?',
    deleteCandidateById: 'DELETE FROM candidate_register WHERE id = ?',
    getEmailID: 'SELECT * FROM candidate_register WHERE Email_ID = ?',
    getMobNum: 'SELECT * FROM candidate_register WHERE mobile_number = ?',
    getAppliedJobs: 'SELECT * FROM job_apply WHERE candidate_id = ?',
    getCandidateID: 'SELECT id FROM candidate_register WHERE first_name = ?',
    //--------Employer -----------------
    getEmpolyerDetails: 'SELECT * FROM employer_master',
    //--------Applied Jobs ------------
    getAllAppliedJobs: 'SELECT * FROM job_apply',
    getCandidateDetails: 'SELECT job_post.job_title, job_post.c_name, job_post.state, candidate_register.first_name, candidate_register.mobile_number, candidate_register.address, candidate_register.id FROM job_apply LEFT JOIN job_post ON job_apply.job_id = job_post.id LEFT JOIN candidate_register ON job_apply.candidate_id = candidate_register.id ORDER BY job_apply.id DESC;',
    getResume: 'SELECT Candidate_Resume FROM onecallhruat.candidate_register WHERE id = ?'
}
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('../backend/config/db');
const indexRoute = require('../backend/routes/index');
const jobPostsRoute = require('../backend/routes/jobPosts');
const candidateRoute = require('../backend/routes/candidateRegistration');
const employerMaster = require('../backend/routes/employerMaster');
const appliedJobs = require('../backend/routes/appliedJobs');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const { applyJobPost } = require('./config/sqlQueries');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRoute);
app.use('/send-email', indexRoute);
app.use('/send-sms-otp', indexRoute);
app.use('/send-mail-otp', indexRoute);
app.use('/job-posts', jobPostsRoute);
app.use('/candidate', candidateRoute);
app.use('/get-empolyer-details', employerMaster);
app.use('/applied-jobs', appliedJobs);

const privateKeyPath = '../backend/config/private-key.txt';
const caBundlePath = '../backend/config/ca-bundle.txt';

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(caBundlePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
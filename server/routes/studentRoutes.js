const express = require('express');
const { loginOrRegisterStudent } = require('../controllers/studentController');
const router = express.Router();

// Route to add a student
router.post('/loginOrRegisterStudent', loginOrRegisterStudent);

module.exports = router;

const Student = require('../models/studentModel');

// Add a new student
const loginOrRegisterStudent = async (req, res) => {
    const { name } = req.body;
  
    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Name is required.' });
    }
  
    try {
      // Check if a student with the same name already exists
      const existingStudent = await Student.findOne({ name });
  
      if (existingStudent) {
        // If student exists, log them in (return existing student details)
        return res.status(200).json({ studentId: existingStudent._id, name: existingStudent.name });
      } else {
        // If student doesn't exist, create a new one
        const newStudent = new Student({ name });
        await newStudent.save();
  
        // Return the new student's ID
        return res.status(201).json({ studentId: newStudent._id, name: newStudent.name });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error logging in or registering student', error });
    }
  };
  

module.exports = { loginOrRegisterStudent };

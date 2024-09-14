const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true

  },
  email: {
    type: String,
    required: false,
    unique:false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;

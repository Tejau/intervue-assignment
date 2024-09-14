const mongoose = require('mongoose');
const { Schema } = mongoose;

const pollSchema = new Schema({
  question: {
    type: String,
    required: true
  },
  options: [
    {
      text: {
        type: String,
        required: true
      },
      // Array of student IDs who selected this option
      selectedBy: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student'
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;

var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true
},
  password: {
    type: String,
    required: true
},
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create user Schema
const userSchema = new Schema({
  username: {
    type: String,
    required:[true, 'Name fild is require']
  },
  password:{
    type: String,
    required:[true, 'birthday fild is require']
  },
  profilePicture:{
    type: String,
    required:[true, 'brithplace fild is require']
  },
});
const user = mongoose.model('UserCollection', userSchema);
module.exports = user;

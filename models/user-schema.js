/**
 * Created by kcp on 7/18/17.
 */
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _ID: ObjectId,
    name: String,
    email: String,
    profile_picture: String,
    job_posted:Array,
    job_done: Array

});

module.exports = mongoose.model('user',userSchema);
/**
 * Created by kcp on 7/18/17.
 */
var mongoose = require('mongoose');

var jobSchema = new mongoose.Schema({
    _ID: ObjectId,
    name: String,
    description: String,
    category: String,
    location: [ Number, Number],
    duration: Number,
    'hourly_rate':Number,
    'preferred_date' : Date,
    'preferred_time' : String,
    'posted_by': Array,
    'applied_by': Array,
    status: String
});
jobSchema.index({'prefered_date':-1,name: 1});

// jobSchema.methods.posted_by=function(){
//     return
// }

module.exports = mongoose.model('job',jobSchema);
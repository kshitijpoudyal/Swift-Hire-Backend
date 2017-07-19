/**
 * Created by kcp on 7/18/17.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send("hello");

});
// router.get('/job-history', function (req, res, next) {
//     let today = new Date().toISOString();
//     req.db.users.find({}).toArray(function (err, data) {
//         if (err) {
//             res.json({
//                 status: 'failed',
//                 message: 'Oops, something went wrong!'
//             });
//         } else {
//             res.json({
//                 status: 'success',
//                 jobs: data
//             });
//         }
//     });
// });
/**
 * Created by kcp on 7/18/17.
 */
var express = require('express');
var router = express.Router();

router.get('/job-history', function (req, res, next) {
    let today = new Date().toISOString();
    req.db.users.find({}).toArray(function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            res.json({
                status: 'success',
                user_jobs_applyed: data,
                user_jobs_posted: data.jobs_posted
            });
        }
    });
});

module.exports = router;
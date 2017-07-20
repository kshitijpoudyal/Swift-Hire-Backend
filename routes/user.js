/**
 * Created by kcp on 7/18/17.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Job = require('../models/Job');

router.get('/profile/posted-jobs/:id', function (req, res, next) {
    let id = req.params.id;

    req.db.users.findOne({ _id: id }, { jobs_posted: 1 }, function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            res.json({
                status: 'success',
                jobs: data
            });
        }
    });

});

router.get('/profile/posted-jobs/jobs/:id', function (req, res, next) {
    req.db.jobs.findOne({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            res.json({
                status: 'success',
                jobs: data
            });
        }
    });
});

router.get('/profile/applied-jobs/:id', function (req, res, next) {
    let id = req.params.id;

    req.db.users.findOne({ _id: id }, { jobs_applied: 1 }, function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            res.json({
                status: 'success',
                jobs: data
            });
        }
    });
});

router.get('/profile/applied-jobs/jobs/:id', function (req, res, next) {
    req.db.jobs.findOne({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            res.json({
                status: 'success',
                jobs: data
            });
        }
    });
});

router.post('/add', function (req, res, next) {
    let userInfo = new User(req.body.userInfo);

    req.db.users.findOne({ _id: userInfo._id }, function (err, dbUser) {
        if (!err && !dbUser) {
            req.db.users.save(userInfo);
        }
    });
});

router.post('/comment', function (req, res, next) {
    let db = req.db;
    let job = req.body.jobId;
    let employeeId = req.body.uId;
    req.db.users.findOne({ _id: employeeId }, function (err, userData) {
        if (err) {
            res.json({
                status: "OOPsss Something went wrong!!!"
            })
        }
        for (let dd in userData.jobs_posted) {
            if (userData.jobs_posted[dd].job_id == job) {
                userData.jobs_posted[dd].feedback = req.body.feedback;
                userData.jobs_posted[dd].rating = req.body.rating;
                db.users.save(userData);
                res.json({
                    status: "Done",
                    data: userData.jobs_posted[dd].feedback,
                    rating: userData.jobs_posted[dd].rating
                })
            }
        }

    });

});



router.post('/commentPosted', function (req, res, next) {
    let db = req.db;
    let job = req.body.jobId;
    let employerId = req.body.empId;
    req.db.users.findOne({_id: employerId}, function (err, userData) {
        if (err) {
            res.json({
                status: "OOPsss Something went wrong!!!"
            })
        }
        for (let dd in userData.jobs_applied) {
            if (userData.jobs_applied[dd].job_id == job) {
                userData.jobs_applied[dd].feedback = req.body.feedback;
                userData.jobs_applied[dd].rating = req.body.rating;
                db.users.save(userData);
                res.json({
                    status: "Done",
                    data: userData.jobs_applied[dd].feedback,
                    rating: userData.jobs_applied[dd].rating
                })
            }
            
        }
      
    });
});

router.post('/approve', function (req, res, next) {
    let userInfo = new User(req.body.userInfo);
    let jobInfo = new Job(req.body.jobInfo);

    req.db.users.save(userInfo);
    req.db.jobs.save(jobInfo);

    res.json({
        status: 'success',
        message: 'User has been approved successfully!'
    });
});

module.exports = router;
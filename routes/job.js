/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Job = require('../models/Job');

// api to add new job post
router.post('/add', function (req, res, next) {

    let db = req.db;

    let jobInfo = new Job(req.body.jobInfo);
    let userInfo = new User(req.body.userInfo);

    let id = userInfo._id;

    db.users.findOne({_id: id}, function (err, dbUser) {
        if (!err) {
            if (dbUser) {
                jobInfo._id = dbUser._id + (dbUser.jobs_posted.length + 1);
                dbUser.jobs_posted.push({
                    job_id: jobInfo._id,
                    title: jobInfo.title,
                    feedback: '',
                    rating: -1,
                    preferred_date: jobInfo.preferred_date
                });
                jobInfo.posted_by = dbUser;

                db.jobs.save(jobInfo);
                db.users.save(dbUser);
              
                res.json({
                    status: 'success',
                    job: jobInfo
                });
            } else {
                res.json({
                    status: 'failed',
                    message: 'Oops, user does not exist in our system, please sign in again!'
                });
            }
        } else {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        }
    });
});

router.get('/search', function (req, res, next) {
    let searchParams = {
        searchQuery: req.query.searchQuery,
        category: req.query.category,
        location: req.query.location,
        minFees: parseFloat(req.query.minFees)
    };

    let today = new Date().toISOString();

    req.db.jobs.find({
        $and: [
            {'preferred_date': {$gte: today}},
            {'category': {$regex: searchParams.category, $options: 'i'}},
            {'location.address': {$regex: searchParams.location, $options: 'i'}},
            {'hourly_rate': {$gte: searchParams.minFees}},
            {
                $or: [{
                    'title': {
                        $regex: searchParams.searchQuery,
                        $options: 'i'
                    }
                }, {'description': {$regex: searchParams.searchQuery, $options: 'i'}}]
            }
        ]
    }).sort({preferred_date: 1}).limit(10).toArray(function (err, data) {
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

router.post('/apply', function (req, res, next) {
    res.json(req.body);

});

router.get('/list', function (req, res, next) {
    let today = new Date().toISOString();
    req.db.jobs.find({
        'preferred_date': {$gte: today}
    }).sort({preferred_date: 1}).imit(10).toArray(function (err, data) {
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

req.db.jobs.find().toArray(function (err, data) {
    console.log(data);
    router.get('/list/postedjobs/:id', function (req, res, next) {
        let today = new Date().toISOString();
        req.db.jobs.find({
            'posted_by._id': req.params.id,
            'preferred_date': {$gte: today}
        }).sort({preferred_date: 1}).limit(10).toArray(function (err, data) {
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

    module.exports = router;
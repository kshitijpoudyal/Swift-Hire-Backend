/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();
var User = require('../models/User');
var Job = require('../models/Job');

let sendSearchResult = function (req, res, searchQuery) {
    req.db.jobs.find(searchQuery).sort({ preferred_date: 1 }).limit(10).toArray(function (err, data) {
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
};

// api to add new job post
router.post('/add', function (req, res, next) {
    let db = req.db;
    let jobInfo = new Job(req.body.jobInfo);
    let userInfo = new User(req.body.userInfo);

    let id = userInfo._id;

    db.users.findOne({ _id: id }, function (err, dbUser) {
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

router.get('/search/:id', function (req, res, next) {
    let searchParams = {
        searchQuery: req.query.searchQuery,
        category: req.query.category,
        location: req.query.location,
        minFees: parseFloat(req.query.minFees) ? parseFloat(req.query.minFees) : 0
    };

    let searchQuery;
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - 1);
    let today = todayDate.toISOString();

    searchQuery = {
        $and: [
            { 'preferred_date': { $gte: today } },
            { 'category': { $regex: searchParams.category, $options: 'i' } },
            { 'hourly_rate': { $gte: searchParams.minFees } },
            {
                $or: [{
                    'title': {
                        $regex: searchParams.searchQuery,
                        $options: 'i'
                    }
                }, { 'description': { $regex: searchParams.searchQuery, $options: 'i' } }]
            },

            { 'status': 'pending' },
            { 'posted_by._id': { $ne: req.params.id } },
            { 'applied_by': { $not: { $elemMatch: { '_id': req.params.id } } } }
        ]
    };

    if (searchParams.location !== '') {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchParams.location}&key=AIzaSyA4HC3r8pJPemOT8ExqkdgSXHFdIAf19JM`).then(response => response.json()).then(data => {
            if (data.status === 'OK') {
                searchQuery = {
                    $and: [
                        { 'preferred_date': { $gte: today } },
                        { 'category': { $regex: searchParams.category, $options: 'i' } },
                        {
                            "location.coords": {
                                $near: {
                                    $geometry: {
                                        type: "Point",
                                        coordinates: [data.results[0].geometry.location.lng, data.results[0].geometry.location.lat]
                                    }, $maxDistance: 10000
                                }
                            }
                        },
                        { 'hourly_rate': { $gte: searchParams.minFees } },
                        {
                            $or: [{
                                'title': {
                                    $regex: searchParams.searchQuery,
                                    $options: 'i'
                                }
                            }, { 'description': { $regex: searchParams.searchQuery, $options: 'i' } }]
                        },
                        { 'status': 'pending' },
                        { 'posted_by._id': { $ne: req.params.id } },
                        { 'applied_by': { $not: { $elemMatch: { '_id': req.params.id } } } }
                    ]
                }
            }
            sendSearchResult(req, res, searchQuery);
        }).catch(err => {
            throw err
        });

    } else {
        sendSearchResult(req, res, searchQuery);

    }

});

router.post('/apply', function (req, res, next) {
    let db = req.db;
    let jobInfo = new Job(req.body.jobInfo);
    let user = new User(req.body.userInfo);
    let id = user._id;
    let jobId = jobInfo._id;
    db.users.findOne({
        '_id': id
    }, function (err, usersFound) {
        if (err) console.error(err);
        if (usersFound) {
            usersFound.jobs_applied.push(
                {
                    job_id: jobInfo._id,
                    title: jobInfo.title,
                    feedback: '',
                    rating: -1,
                    preferred_date: jobInfo.preferred_date,
                    granted: false
                }
            );
            jobInfo.applied_by.push(usersFound);
            db.jobs.save(jobInfo);
            db.users.save(usersFound);
            res.json({
                status: "Successfully applied for this job",
                jobsInfo: jobInfo,
                user: usersFound
            })

        }
        else {
            res.json({
                status: "User not found"
            })
        }
    });


});

router.get('/list/:id', function (req, res, next) {
    let todayDate = new Date();
    todayDate.setDate(todayDate.getDate() - 1);
    let today = todayDate.toISOString();
    req.db.jobs.find({
        'preferred_date': { $gte: today },
        'status': 'pending',
        'posted_by._id': { $ne: req.params.id },
        'applied_by': { $not: { $elemMatch: { '_id': req.params.id } } }
    }).sort({ preferred_date: 1 }).limit(10).toArray(function (err, data) {
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
        // res.json({
        //     status: "error",
        //     data: "not posted"
        // })

    });

});


router.post('/commentPosted', function (req, res, next) {
    let db = req.db;
    let job = req.body.jobId;
    let employerId = req.body.uId;
    req.db.users.findOne({ _id: employerId }, function (err, userData) {
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
                break;
            }
            else {
                res.json({
                    status: "No Comment possible",
                    data: userData.jobs_applied[dd]
                })
            }
        }
    });

});
module.exports = router;
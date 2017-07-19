/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var fetch = require('node-fetch');
var router = express.Router();
var User = require('../models/User');
var Job = require('../models/Job');

let sendSearchResult = function (req, res, searchQuery) {
    req.db.jobs.find(searchQuery).sort({preferred_date: 1}).limit(10).toArray(function (err, data) {
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

router.get('/search', function (req, res, next) {
    let searchParams = {
        searchQuery: req.query.searchQuery,
        category: req.query.category,
        location: req.query.location,
        minFees: parseFloat(req.query.minFees) ? parseFloat(req.query.minFees) : 0
    };

    let searchQuery;
    let today = new Date().toISOString();

    searchQuery = {
        $and: [
            {'preferred_date': {$gte: today}},
            {'category': {$regex: searchParams.category, $options: 'i'}},
            {'hourly_rate': {$gte: searchParams.minFees}},
          
            {
                $or: [{
                    'title': {
                        $regex: searchParams.searchQuery,
                        $options: 'i'
                    }
                }, { 'description': { $regex: searchParams.searchQuery, $options: 'i' } }]
            }
        ]
    };

    if (searchParams.location !== '') {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${searchParams.location}&key=AIzaSyA4HC3r8pJPemOT8ExqkdgSXHFdIAf19JM`).then(response => response.json()).then(data => {
            if (data.status === 'OK') {
                // req.db.jobs.createIndex({'location.coords': '2d'});
                searchQuery = {
                    $and: [
                        {'preferred_date': {$gte: today}},
                        {'category': {$regex: searchParams.category, $options: 'i'}},
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
                    preferred_date: jobInfo.preferred_date
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

        }
    });


});

router.get('/list', function (req, res, next) {
    let today = new Date().toISOString();
    req.db.jobs.find({
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

router.get('/list/postedjobs/:id', function (req, res, next) {
    let today = new Date().toISOString();
    req.db.jobs.find({
        'posted_by._id': req.params.id,
        'preferred_date': { $gte: today }
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

module.exports = router;
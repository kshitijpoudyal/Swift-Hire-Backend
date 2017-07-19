/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var router = express.Router();

// api to add new job post
router.post('/add', function (req, res, next) {

    let db = req.db;

    let userInfo = req.body.userInfo;
    let jobInfo = req.body.jobInfo;
    jobInfo.status = 'pending';

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
                    preferred_date: jobInfo.preferredDate
                });

                jobInfo.posted_by = dbUser;
                jobInfo.applied_by = [];

                db.jobs.save(jobInfo);
                db.users.save(dbUser);

                res.json({
                    status: 'success',
                    message: 'Job has been posted successfully!'
                });

            } else {

                jobInfo._id = userInfo._id + "0";
                userInfo.jobs_posted = [{
                    job_id: jobInfo._id,
                    title: jobInfo.title,
                    feedback: '',
                    rating: -1,
                    preferred_date: jobInfo.preferredDate
                }];
                userInfo.jobs_applied = [];

                jobInfo.posted_by = userInfo;
                jobInfo.applied_by = [];

                db.jobs.save(jobInfo);
                db.users.save(userInfo);

                res.json({
                    status: 'success',
                    message: 'Job has been posted successfully!'
                });
            }
        }

    });
});

router.get('/search', function (req, res, next) {
    res.json({
        searchQuery: req.query.searchQuery,
        category: req.query.category,
        location: req.query.location,
        minFees: req.query.minFees
    });
});


router.get('/list',function (req,res,next) {
    let filterDate = {
        preferred_date:{$gte:new Date()}
    }

    req.db.jobs.find({}).toArray(function (err,data) {
        console.log(data);
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

    // post = [{
    //     title: 'job title',
    //     description: 'description',
    //     category: 'plumber',
    //     location: {
    //         address: 'fairfield',
    //         coors: [1231,23123]
    //     },
    //     hourly_rate: '20',
    //     preferred_date: '17/08/2017',
    //     preferred_time: '12:00',
    //     posted_by: {user:'username'},
    //     applied_by: [{user:'one'},{user:'two'}],
    //     status: 'Ongoing' // Ongoing, Completed, Pending
    // },
    //     {
    //         title: 'job title',
    //         description: 'description',
    //         category: 'plumber',
    //         location: {
    //             address: 'fairfield',
    //             coors: [1231,23123]
    //         },
    //         hourly_rate: '20',
    //         preferred_date: '17/08/2017',
    //         preferred_time: '12:00',
    //         posted_by: {user:'username'},
    //         applied_by: [{user:'one'},{user:'two'}],
    //         status: 'Ongoing' // Ongoing, Completed, Pending
    //     }];
    //res.json(post);

});

module.exports = router;
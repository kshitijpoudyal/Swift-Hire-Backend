/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var router = express.Router();
var db;

router.all(function (req, res, next) {
    this.db = req.db;
    next();
});

// api to add new job post
router.post('/add', function (req, res, next) {

    let id = req.body.user.identities[0].id;

    db.users.findOne({_id: id}, function (err, data) {
        if (err) {
            res.json({
                status: 'failed',
                message: 'Oops, something went wrong!'
            });
        } else {
            if (data) {
                res.json({
                    status: 'success',
                    user: data,
                    post: 'New Post Info'
                });
            } else {
                res.json({
                    status: 'success',
                    user: 'New User Info',
                    post: 'New Post Info'
                })
            }
        }
        res.end();
    });

    post = {
        title: '',
        description: '',
        category: '',
        location: {
            address: '',
            coors: []
        },
        hourly_rate: '',
        preferred_date: '',
        preferred_time: '',
        posted_by: {},
        applied_by: [],
        status: '' // Ongoing, Completed, Pending
    };

    let user = {
        _id: '',
        name: '',
        email: '',
        profile_picture: ''
    };
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
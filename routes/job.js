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

router.post('/apply',function(req,res,next){
    res.json(req.body);
    
});

module.exports = router;
/**
 * Created by kcp on 7/18/17.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.get('/profile/posted-jobs/:id', function (req, res, next) {
    let id = req.params.id;

    req.db.users.findOne({_id:id},{jobs_posted:1},function (err, data) {
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
    },function (err, data) {
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

    req.db.users.findOne({_id:id},{jobs_applied:1},function (err, data) {
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
    },function (err, data) {
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

    req.db.users.findOne({_id: userInfo._id}, function (err, dbUser) {
        if (!err && !dbUser) {
            req.db.users.save(userInfo);
        }
    });
});

module.exports = router;
/**
 * Created by kcp on 7/18/17.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/User');

router.post('/add', function (req, res, next) {
    let userInfo = new User(req.body.userInfo);

    req.db.users.findOne({_id: userInfo._id}, function (err, dbUser) {
        if (!err && !dbUser) {
            req.db.users.save(userInfo);
        }
    });
});

module.exports = router;
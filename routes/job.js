/**
 * Created by Sulav on 7/17/17.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/add', function (req, res, next) {
    res.json({status: 'success'});
});

router.get('/search', function (req, res, next) {
    res.json({
        searchQuery: req.query.searchQuery,
        category: req.query.category,
        location: req.query.location,
        minFees: req.query.minFees
    });
});

module.exports = router;
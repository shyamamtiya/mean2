var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('../models/category');

var categories = db.collection('categories');

router.get('/category', function(req, res) {
	categories.find().toArray(function(err, data) {
		if (err) throw err;
		res.send(data);
	});
});

router.post('/category', function(req, res) {
	categories.find({ _id: req.body.item }).toArray(function(err, response) {
		if (err) throw err;
		else if (response.length) {
			var newvalues = { $set: { children: req.body.children } };
			categories.updateOne({ _id: req.body.item }, newvalues, function(err, response) {
				if (err) throw err;
				res.send('updated');
			});
		} else {
			categories.insert({ _id: req.body.item, children: req.body.children }, function(err, response) {
				if (err) throw err;
				res.send('created');
			});
		}
	});
});

router.post('/removesubcategory', function(req, res) {
	console.log(req.body);
	categories.find({ _id: req.body.item }).toArray(function(err, response) {
		if (err) throw err;
		else if (response.length) {
			var newvalues = { $set: { children: req.body.children } };
			categories.updateOne({ _id: req.body.item }, newvalues, function(err, response) {
				if (err) throw err;
				res.send('updated');
			});
		}
	});
});
router.post('/removecategory', function(req, res) {
	console.log(req.body);
	categories.deleteOne({ _id: req.body.item }, function(err, response) {
		if (err) throw err;
		res.send('deleted');
	});
});
module.exports = router;

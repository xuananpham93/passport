var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Quote = require('../models/quote');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { 
		title: 'Express'
	});
});

router.route('/todo')
.get(function (req, res, next) {
	User.findById(req.session.user_id)
	.exec(function (error, user) {
		if (error) {
			return next(error);
		} 

		if (user === null) {
			var err = new Error('Not authorized! Go back!');
			err.status = 400;
			return next(err);
		} 

		Quote.find({}, function(err, quotes) {
			if (!err){

				return res.render('todo', {
					title: 'Todo',
					quotes: quotes
				});

			} else {throw err;}
		});

	});
})


router.post('/todo/add', function (req, res, next){

	var todo = new Quote(req.body);

	todo.save(function (err, quote) {  
		if (err) 
			return console.log(err);
		

		return res.redirect('/todo');
	});
});

router.get('/todo/success/:id/:status', function (req, res, next){


	if (req.params.status == 0) {
		var update = { status:  1};
	}else{
		var update = { status:  0};
	}

	Quote.findByIdAndUpdate(req.params.id, update, function(err, todo){
		if (err)
			return console.log(err);

		return res.redirect('/todo');
	})

});

router.get('/todo/delete/:id', function (req, res, next){

	Quote.findByIdAndRemove(req.params.id, function (err, todo) {  
		if (err) 
			return console.log(err);

		return res.redirect('/todo');
	});

});


module.exports = router;

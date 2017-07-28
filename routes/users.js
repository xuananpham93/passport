var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var fileLoad = upload.single('profileImage');
var User = require('../models/user');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.route('/register')
    .post(fileLoad, function (req, res) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
        var passwordConf = req.body.passwordConf;
        var profileImage;

        if (req.file) {
            profileImage = req.file.filename;
        } else {
            profileImage = 'no_image.png';
        }

        // use express validator
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('passwordConf', 'PasswordConf do not match').equals(req.body.password);
        
        req.getValidationResult().then( function(result) {
            if (result) {
                User.create({
                    name: name,
                    email: email,
                    password: password,
                    passwordConf: passwordConf,
                    profileImage: profileImage

                }).then(function () {
                    req.flash('success', 'Register successfully');
                    res.redirect('/');

                }).catch(function (err) {
                    throw err;
                });
            }
        });

    });

router.route('/login')
    .post(function (req, res, next) {

        var email = req.body.email;
        var password = req.body.password;

        User.authenticate(email, password, function(err, user){
            if (err) {
                var err = new Error('Email or password wrong');
                err.status = 401;
                return next(err);
            }

            req.session.user_id = user._id;

            return res.redirect('/todo');

        });
    });


module.exports = router;

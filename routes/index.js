var express = require('express');
var passport = require('passport');
var router = express.Router();
var Youtubedl = require('youtube-dl');
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/*router.get('/login', function (req, res, next) {
    res.render('login.ejs', {message: req.flash('loginMessage')});
});

router.get('/signup', function (req, res) {
    res.render('signup.ejs', {message: req.flash('loginMessage')});
});*/

router.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {user: req.user});
});
router.post('/download', isLoggedIn, function (req, res) {
    var url = req.body.url;
    console.log(" i am in download body " + url);
    var video = new Youtubedl(url, []);
    var fileInfo;
    video.on('info', function (info) {
        fileInfo=info;
        console.log(" downloading file " + info._filename);
        res.setHeader('Content-disposition', 'attachment; filename=' + info._filename);
    });
    video.on('data', function data(chunk) {
        res.write(chunk);
    })
    video.on('end', function () {
        res.status(200).end();
    });
    video.on('error', function (err) {
        //Emit error event when there is any error
        console.error(err);
        res.redirect('/profile');
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
/*
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}));*/

/*
router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));
*/

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

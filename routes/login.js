'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();

// ログイン画面表示
router.get('/', function (req, res) {
    res.render('login', {
        error: req.flash('error'),
        input_id: req.flash('input_id'),
        input_password: req.flash('input_password')
    });
});

// ログイン情報入力
router.post('/', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;
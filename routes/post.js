// var posts = [
//     {title: 'title0', body: 'body0'},
//     {title: 'title1', body: 'body1'},
//     {title: 'title2', body: 'body2'}
// ];
var db = require('./db');

exports.index = function(req, res){
    db.serialize(function() {
        db.all('SELECT * from posts',function(err, rows) {
            console.log(rows);
            res.render('posts/index', {posts: rows});
        });
    });
    // res.render('posts/index', {posts: posts});
};

exports.about = function(req, res){
    res.render('posts/about');
};

exports.login = function(req, res){
    res.render('posts/login', {input_id: 0, input_password: "0000"});
};

exports.show = function(req, res){
    db.serialize(function() {
        db.all('SELECT * from posts',function(err, rows) {
            console.log(rows);
            res.render('posts/show', {posts: rows[req.params.id]});
        });
    });
    // res.render('posts/show', {posts: posts[req.params.id]});
};

exports.new = function(req, res){
    res.render('posts/new');
};

exports.create = function(req, res){
    // var post = {
    //     title: req.body.title,
    //     body: req.body.body
    // };
    db.serialize(function() {
        db.all('insert into posts ("title", "body") values("' + req.body.title + '", "' + req.body.body + '")');
    });
    // posts.push(post);
    res.redirect('/');
};

exports.edit = function(req, res){
    db.serialize(function() {
        db.all('SELECT * from posts',function(err, rows) {
            console.log(rows);
            res.render('posts/edit', {post: rows[req.params.id], id: req.params.id});
        });
    });
    // res.render('posts/edit', {post: posts[req.params.id], id: req.params.id});
};

exports.update = function(req, res){
    db.serialize(function() {
        query = 'UPDATE posts SET "title" = "' + req.body.title;
        query = query + '", "body" = "' + req.body.body;
        query = query + '" where id = ' + (parseInt(req.params.id)+1);
        console.log(query);
        db.all(query, function(err, rows) {
            console.log(rows);
        });
    });
    // posts[req.body.id] = {
    //     title: req.body.title,
    //     body: req.body.body
    // };
    res.redirect('/');
};

exports.destroy = function(req, res){
    db.serialize(function() {
        query = 'DELETE FROM posts where id = ' + (parseInt(req.params.id)+1);
        console.log(query);
        db.all(query, function(err, rows) {
            console.log(rows);
        });
    });
    // posts.splice(req.body.id, 1);
    res.redirect('/');
};
'use strict';

var express = require('express')
var fs = require('fs')
var marked = require('marked')
var mongo = require('mongodb').MongoClient
  
var app = new express()
    
var url = 'mongodb://effy:123123@ds133657.mlab.com:33657/url-shortener'

mongo.connect(url, function(err, client) {
  if (err) {
    throw err
  } else {
    console.log('Successfully connected to MongoDB.');
  }



  var port = process.env.PORT || 8080;
  app.listen(port, function() {
    console.log('Node.js listening on port ' + port);
  })


  app.get('/', function(req, res) {
    fs.readFile(__dirname + '/README.md', function(err, data) {
      if(err) return 
      var html = marked(data.toString())
      res.send(html)
    }) 
  })

  app.get('/new', function(req, res) {
    res.send('Error: You need to add a proper url')
  })

  app.get('/new/:url*', function(req, res) {
    // Create short url, store and display the info.
    var url = req.url.slice(5);
    var urlObj = {};
    if (isURL(url)) {
      urlObj = {
        "original_url": url,
        "short_url": req.protocol + '://' + req.hostname + '/' + linkGen()
      };
      res.send(urlObj)
      save(urlObj, client)
      client.close()
    } else {
      urlObj = {
        "error": "the url format is not right"
      };
      res.send(urlObj);
    }
  })
 

  app.get('/:url', function(req, res) {
    var url = req.protocol + '://' + req.hostname + '/' + req.params.url;      console.log(url)
    if (url != req.protocol + '://' + req.hostname + '/' + 'favicon.ico') {
      console.log(url)
      findURL(url, client, res);
    }
  })
})




  function isURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }

  function linkGen() {
    // Generates random four digit number for link
    var num = Math.floor(100000 + Math.random() * 900000);
    return num.toString().substring(0, 4);
  }

  function save(obj, client) {
    // Save object into db.
    var db = client.db('url-shortener')
    var sites = db.collection('site');
    sites.save(obj, function(err, result) {
      if (err) throw err;
      console.log('Saved ' + result);
      client.close()
    });
  }


  function findURL(link, client, res) {
    var db = client.db('url-shortener')
    // Check to see if the site is already there
    var sites = db.collection('site');
    // get the url
    sites.findOne({
      "short_url": link
    }, function(err, result) {
      if (err) throw err;
      // object of the url
      if (result) {
        // we have a result
        console.log('Found ' + result);
        console.log('Redirecting to: ' + result.original_url);
        res.redirect(result.original_url);
      } else {
        // we don't
        res.send('Site not found');
      }
    })
  }
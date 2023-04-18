//jshint esversion: 6

  const express = require('express');
  const bodyParser = require('body-parser');
  const request = require('request');
  const https = require('https');
  const mailchimp = require("@mailchimp/mailchimp_marketing");

  const app = express();
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static('public'));

  app.get('/', function(req, res) {
    console.log("refreshed");
    res.sendFile(__dirname + "/singup.html");
  });

  app.post('/', function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const eMail = req.body.email;

    const data = {
      members: [
        {
          email_address: eMail,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    }
    const jsonData = JSON.stringify(data);

    const url = 'https://us18.api.mailchimp.com/3.0/lists/eb00808aeb';

    const { options } = require('./keys.js');

    const request = https.request(url, options, function(response){
      if (response.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
      }else {
        res.sendFile(__dirname + "/failure.html");
      }


      response.on("data", function(data){
        console.log(JSON.parse(data));
      });
    });
    request.write(jsonData);
    request.end();

  });

  app.post("/failure", function(req, res){
    res.redirect("/");
  });


  app.listen(process.env.PORT || 3000, function(){
    console.log("listening port: 3000");
  });

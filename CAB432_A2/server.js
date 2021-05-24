//Requirements
const Twit = require('twit');
const http = require('http');
const express = require('express')
const axios = require('axios');
const redis = require('redis');
const AWS = require('aws-sdk');
const md5 = require('md5');
const app = express();
const WebSocket = require('ws');
const port = process.env.PORT||8000;
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server: server });
const redisClient = redis.createClient();
var natural = require('natural');
var tokenizer = new natural.WordTokenizer();
var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;

//Error Catching for Redis
redisClient.on('error', (err) => {
  console.log("Error " + err);
});

require('dotenv').config();
var pug = require('pug');
var html = pug.renderFile('./Templates/home.pug')
var socket;

//WebSocket Connection
wss.on('connection', function connection(ws) {
  socket=ws; 
});

//GET method route
app.get('/', (req, res) => {
  res.send(html); 
  try {
    tweet.stop();
  } catch (error) {    
  }
});

//Loading scripts.js for backend processing
app.use(express.static(__dirname+'/scripts'));
server.listen(8000, () => console.log(`Lisening on port :8000`))

//Twitter Authorization
const T = new Twit({
  consumer_key: 'lsC0TcZIonY2KG150E9fB84Hr',
  consumer_secret: 'VyJurWv1qlXiE5vjUAdcWZhuYgwJe1GlWvr0RiyGnZLivbZGHV',
  access_token: '1314485729041379333-jq4989oUDULOX0K71arilqzeKtKkMC',
  access_token_secret: '7L4oMHAqIZO69RchauOU5b09bJ707VNLHr42orKXKncZm',
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});


//Routing search query to our 'index page'
var tweet;
app.get('/index', async function (req, res, next) {
  var query = req.query.word;
  //Taking our search, calling the two API's, and rendering the contents to our Pug file. 
  try {
    tweet =  (await T.stream('statuses/filter', { track: query }));
    var body =  pug.renderFile('./Templates/index.pug', { 'query': query})    
    var analyzer = new Analyzer("English", stemmer, "afinn");
    res.send(body)  
      //retrieve from cache. 
    tweet.on('tweet', function (tweet) {
      // console.log(tweet);
      try {
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            var data = {
              'tweet': tweet.text,
              'author': tweet.user.name,
              'profilePic': tweet.user.profile_image_url,
              'sentiment': analyzer.getSentiment(tokenizer.tokenize(tweet.text)).toFixed(2)              
            };

            redisClient.lpush(`${query}`, 3600, JSON.stringify(data)); //redis - caching, lrange cat 0 -1
            client.send(JSON.stringify(data));  
          }
        });
      }
      catch(err) {
        console.log(err);
      }
    });
}

//Statement catching any search errors
  catch (err) {
    next(err)
    console.log(err);
  }
});

//Stop Button
app.get('/stop', async function (req, res, next) {
  console.log("stop")
  try {
    tweet.stop(); 
  }
  catch(error){    
  }
})

//Start Button
app.get('/start', async function (req, res, next) {
  console.log("start")
  try {
    tweet.start();
  }
  catch(error){    
  }
})

//Routing if errors occur -> sends user to error page.
app.use(function(err, req, res, next){
  res.status(500);
  var body=pug.renderFile('./Templates/home.pug', {'message':err})
  res.send(body);
})


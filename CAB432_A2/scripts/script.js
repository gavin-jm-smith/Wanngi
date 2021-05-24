//Local Environment:
const socket = new WebSocket('ws://localhost:8000')

//Opening Web connection socket
socket.addEventListener('open', function (event) {
    console.log('connected to the server!')
})
socket.addEventListener('open', function (event) {
    console.log('Message from server, even.data');
})

//Sentiment Analysis handling
socket.addEventListener('message', function (event){
    var message = JSON.parse(event.data);
    console.log(message);
    var sentimentStatment = message.sentiment;
    if(sentimentStatment >0){
        sentimentStatment = "Positive ("+message.sentiment + ")";
    }
    else if (sentimentStatment === "0.00"){
        sentimentStatment = "Neutral ("+message.sentiment + ")";
    }
    else {
        sentimentStatment = "Negative ("+message.sentiment + ")";
    }
    var row = `<tr><td><img src="${message.profilePic}"></td><td>${message.author}</td><td>${message.tweet}</td><td>${sentimentStatment}</td></tr>`
    $('#tweets').prepend(row) 
})
var isStopped = false;

//Stop/Start Button Handling
$(document).ready(function(){
    $('#stop').on('click', function(){
        if(isStopped){
            $.get('/start');
            $('#stop').attr('value', 'Stop Feed');
        }
        else {
            $.get('/stop');
            $('#stop').attr('value', 'Start Feed');
        }        
        isStopped=!isStopped;
})});




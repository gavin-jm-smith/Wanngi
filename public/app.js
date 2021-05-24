const http = require('http')
var fs = require('fs');
const port = 1000

var server = http.createServer(function(req, res) {
    console.log('request was made: ' + req.url);
    res.writeHead(200, {'Content-Type' : 'text/html'});
    var myReadStream = fs.createReadStream(__dirname + '/index.html', 'utf8');
    myReadStream.pipe(res);
})

server.listen(port, function(error){
    if(error) {
        console.log('There was an error', error)
    } else {
        console.log('Server is lsitening on port ' + port)
    }
})

import { PluginNotification } from "./interfaces/plugin.notification";
import { Subject } from "rxjs";
import { Plugin } from './main'
// import fs = require('fs');
import http = require('http');


// fs.readFile('./index.html', function (err, html) {
//     if (err) {
//         throw err; 
//     }       
//     http.createServer(function(request, response) {  
//         response.writeHeader(200, {"Content-Type": "text/html"});  
//         response.write(html);  
//         response.end();  
//     }).listen(8000);
// });

const html =`<div><label for="appt">Choose a time for your meeting:</label>
<input type="time" id="appt" name="appt"
       min="00:00" max="23:59" required> <button onclick="pluginClick(event)">click here</button></div>
<script>
function pluginClick(event,data) {
  var input = document.getElementById("appt");
  console.log(input.value);
  var timeArray = input.value.split(':');

// Create a new event, allow bubbling, and provide any data you want to pass to the "detail" property
const eventAwesome = new CustomEvent('plugin-input', {
    plugin-id: '',
    data: {
        hour: timeArray[0],
        minute:timeArray[1]
    }
});
}
</script>
`;

http.createServer()
.on('request', function(req, response) {

    response.writeHead(200, {"Content-Type": "text/html"});  
    response.write(html);
    response.end();  
    //response.end('Hello HTTP!');
	// var email = req.url.substr(req.url.lastIndexOf('/')+1)
	// if(!email) {
	// 	res.writeHead(404)
	// 	return res.end()
	// }

	// http.get('http://www.gravatar.com/avatar/'+crypto.createHash('md5').update(email).digest('hex'), function(resp) {
	// 	resp.pipe(res)
	// })
})
.listen(8080)

/*
var server = http.createServer(function(request, response) {  
    response.writeHead(200, {"Content-Type": "text/html"});  
    response.end('Hello HTTP!');});
server.listen();
*/
var testSubjectIn = new Subject<PluginNotification>();
var testSubjectOut = new Subject<PluginNotification>();

testSubjectOut.subscribe({
    next: (val) => {
      console.log(val);
    },
    error: (val) => {
      console.log('error: ', val);
    }
  })


var plugin = new Plugin(testSubjectIn , testSubjectOut, '19', '20');


console.log("HEELLOO")
import { PluginNotification } from "./interfaces/plugin.notification";
import { Subject } from "rxjs";
import { Plugin } from './main'
import { PluginInput } from "interfaces/plugin.input";

// import fs = require('fs');
import http = require('http');

const express = require('express');
const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  const scriptDependencies = `
  <head>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="/socket.io/socket.io.js"></script>
  </head> 
  `
  const listerScript = `
  <script>
    var socket = io();
    window.addEventListener('plugin-input', (e) => {
      e.preventDefault();
      console.log('plugin-input');
      console.log(e);
      socket.emit('socket-plugin-input', e.detail);
    });
  </script>`

  const liveUpdateScript = `
  <script>
  var socket = io();
  socket.on('update-html', function (msg) {
      console.log('update-html', msg);
      $('#plugin-container').html(msg.data)
  });
  </script>
  `

  const notificationContainer = `
  <div id="notification-container" style="border: black; border-width: 1px; border-style: double; padding: 5px 5px 5px 5px; margin-bottom: 10px">
  </div>
  <script>
  var socket = io();
  socket.on('update-notification', function (msg) {
      console.log('update-notification', msg);
      $('#notification-container').text(msg.data)
  });
  </script>
  `

  const pluginHtmlContainer = `
  <div id="plugin-container" style="border: black; border-width: 1px; border-style: dashed; padding: 5px 5px 5px 5px;">
    ${plugin.getHtml()}
  </div>
  `
  
  const htmlString = scriptDependencies + '\n' + notificationContainer + '\n' + pluginHtmlContainer + '\n' + listerScript + '\n' + liveUpdateScript;
    res.writeHead(200, {"Content-Type": "text/html"});  
    res.write(htmlString);
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});

const eventHandlerIn:Subject<PluginInput> = new Subject<PluginInput>();
const eventHandlerOut:Subject<PluginNotification> = new Subject<PluginNotification>();
const id = "My Alarm";

eventHandlerOut.subscribe({
  next: value => {
    console.log('eventHandlerOut.subscribe: ', value);
    io.emit('update-html', { data:value.data }); 
    io.emit('update-notification', { data:value.notificationMessage }); 
  },
  error: err =>
  {
    console.error(err);
  }
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('socket-plugin-input', (msg) => {
    console.log('message received: ', msg);
    eventHandlerIn.next(msg);
  })
});

const plugin = new Plugin(eventHandlerIn,eventHandlerOut,id);

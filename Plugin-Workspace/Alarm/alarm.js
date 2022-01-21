var spawn = require("child_process").spawn;

var time = process.argv[2].split(':');

// Each plugin receives an even handler with which it communicates with the electron app (ping when ready)

function checkTime () {
  var now = new Date();
  
  var toUTC = new Date();
  toUTC.setHours(time[0])
  toUTC.setMinutes(time[1])

  console.log((now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()));

  if (now.getUTCHours() >= toUTC.getUTCHours() && now.getUTCMinutes() >= toUTC.getUTCMinutes()) {
    // if (now.getUTCHours() >= parseInt(time[0]) && now.getUTCMinutes() >= parseInt(time[1])) {
      console.log("WAKE UP");
    /*
    setInterval(function () {
      console.log("WAKE UP");
    }, 1000);
    */
  }
  else {
    console.log(now.getHours() + ':' + now.getMinutes());
    //Check every second
    setTimeout(checkTime, 1000*60);
  }
}

console.log("Setting alarm for: "+time.join(":"));

checkTime();
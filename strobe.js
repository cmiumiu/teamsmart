//Require johnny-five, arduino board and the buttons
var five = require("johnny-five"),
  board, button1, button2;
//Create a new board
board = new five.Board();
//Request the http for API
 var http = require("http");
 //require request libary
var request = require('request');
//Lamp settings
var data = {"on":true, "sat":100, "bri":254,"hue":10000};
//If not holding button down.
var isHoldingDown = false;

//When button clicked
board.on("ready", function() {

  // Create a new `button` hardware instance.
  // This example allows the button module to
  // create a completely default instance
  button1 = new five.Button({
    pin: 2,
    holdtime: 350
  });

  button2 = new five.Button({
    pin: 3,
    holdtime: 350
  });

  // var led = new five.Led(13);
  //Our timer for double click
  var timer = 400;
  //Count our clicks
  var count = 0;
  //API for Phillips Hue
  var HueApi= "http://192.168.10.247/api/28dd08062078de67270d8b6ab5b3f9b/lights/";
  //Bedroom
  var lamp1 = "1/state";
  //Livingroom
  var lamp2 = "2/state";
  //Hallway
  var lamp3 = "3/state";

//Function for changing light on Hue!
  var changeColor = function(lamp, sat, bri, hue) {
    request({
      method: "PUT",
      url: HueApi + lamp,
      json: {
        on: true,
        sat: sat,
        bri: bri,
        hue: hue,
        transitiontime:0,
        alert: "none",
        effect: "none"
        }
      },
      function(err, res, body) {
        //console error
        console.log("err?", err);
      }
    );
  };

  // Inject the `button` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    button: button1
  });

  //When presses down, one click
  button1.on("down", function() {
    //Count our clicks
    count++;
    //If one click
    if  (count === 1) {
      //Set timer
      singelTimer = setTimeout (function() {
        //Count 0
        count = 0;
        //Change color on lamps
        changeColor(lamp1, 100, 100, 20000);
        changeColor(lamp2, 100, 100, 20000);
        changeColor(lamp3, 100, 100, 20000);
        console.log("ett klick");
      }, timer)
      //Else if clicks = 2
    } else if (count === 2) {
      //Change color on lamps
      changeColor(lamp1, 255, 100, 65280);
      changeColor(lamp2, 255, 100, 65280);
      changeColor(lamp3, 255, 100, 65280);
      console.log("två klick");
      //Clear timer!
      clearTimeout(singelTimer);
      count = 0;

    } else if (count === 3) {
      // lös senare!
    }

  }, false)

  // "hold" the button is pressed for specified time.
  button1.on("hold", function() {
    //Count
    count = 0;
    //Clear timer
    clearTimeout(singelTimer);
    //If isHoldingDown = false, make it true!
    if (isHoldingDown == false) {
        isHoldingDown = true;
        //Change color!
        changeColor(lamp1, 100, 100, 50000);
        changeColor(lamp2, 100, 100, 50000);
        changeColor(lamp3, 100, 100, 50000);
    }
    console.log("hold");
    // request('http://www.omdbapi.com/?s=Batman', (err, res, body) => {
    //   console.log(body);
    // })

  });

  // "up" the button is released
  button1.on("up", function() {
    //isHoldingDown become false
    isHoldingDown = false;

  // console.log("up");
  });

  // button2, press down. one click
  button2.on("down", function() {
    //Change color!
    changeColor(lamp1, 100, 100, 10000);
    changeColor(lamp2, 100, 100, 10000);
    changeColor(lamp3, 100, 100, 10000);
  });
});

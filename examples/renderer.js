//console.log("renderer.js loaded")

const { Server , Client} = require('node-osc');


var oscClient = new Client('127.0.0.1', 7788);

// create an osc client
var oscServer = new Server(9699, '0.0.0.0', () => {
  console.log('OSC Server is listening');
  document.getElementById('osc_status').innerHTML="ON";
  document.getElementById('osc_status').style.color="green";
  document.getElementById('port_num').innerHTML=oscServer.port;
});

// oscServer.on('message', function (msg) {
//   console.log(`Message: ${msg}`);
//   if (msg[0].includes("gyro")){
//     console.log("The gyro message is: " + msg[1] + " " + msg[2] + " " + msg[3])
//   }
//   //oscServer.close();
// });



oscServer.on('bundle', function (bundle) {
    bundle.elements.forEach((element, i) => {
        if (element[0].includes("/gyrosc/gyro")){
            //console.log(element);
            //console.log("The gyro message is: " + element[1] + " " + element[2] + " " + element[3])
            update_pan(element[1],element[2],element[3]);
        }
    //   console.log(`Timestamp: ${bundle.timetag[i]}`);
    //   console.log(`Message: ${element}`);
    });
    //oscServer.close();
  });


function update_pan(x,y,z){
    global_config.audio_config.audience_location.pitch = y;
    global_config.audio_config.audience_location.yaw = x;
    global_config.audio_config.audience_location.roll = z;

    document.getElementById('pitch').innerHTML=Math.round(y/Math.PI*180);
    document.getElementById('yaw').innerHTML=Math.round(x/Math.PI*180);
    document.getElementById('roll').innerHTML=Math.round(z/Math.PI*180);

    rotator(x,y,z);

    update_global_config();
}


function rotator(yaw,pitch,roll){
// try to send a float on topic /yaw , /pitch, /roll, on a target port number
// map data from -PI to PI to -180 to 180
yaw = - yaw/Math.PI*180;
// map data from -PI to PI to -90 to 90
pitch = -pitch/Math.PI*180;
// map data from -PI to PI to -180 to 180
roll = -roll/Math.PI*180;
  console.log("The yaw is: " + yaw);
  console.log("The pitch is: " + pitch);
  console.log("The roll is: " + roll);
  oscClient.send('/yaw', yaw );
  oscClient.send('/picth', pitch );
  oscClient.send('/roll', roll );
  console.log("info triggered");
}



function triggerSound(azimuth, play_float, pitch_info, port = 9000){
  // try to send a float on topic /azimuth_0, on a target port number
  // map data from -1 to 1 to -60 to 60
  azimuth = -azimuth*60;

  if (play_float!=0){

  console.log("The azimuth is: " + azimuth);
  oscClient.send('/azimuth_0', azimuth );

  }else{
    console.log("The azimuth is: off");

  }
  //send a float to /Ambisonic_Spatial_Audio/Source__0/Play_Off_On
  oscClient.send('/Ambisonic_Spatial_Audio/Source__0/Play_Off_On', play_float );

  // send a float to /Ambisonic_Spatial_Audio/Source__0/Pitch
  oscClient.send('/Ambisonic_Spatial_Audio/Source__0/Pitch', pitch_info );

  console.log("info triggered");
}

function just_rotate(azimuth,pitch,roll){

  // try to send a float on topic /azimuth_0, on a target port number
  // map data from -1 to 1 to -60 to 60

  azimuth = -azimuth*60;


  console.log("The azimuth is: " + azimuth);
  oscClient.send('/azimuth_0', azimuth );


}



//  function to trigger triggerSound after a certain second period of time
function triggerSoundAfter(azimuth, play_float, pitch_info,time){
  // transfer time into integer time
  time = parseInt(time*1000);
  console.log("The function will be triggered in" +time);
    setTimeout(function(){
        triggerSound(azimuth, play_float,pitch_info);
    }
    ,time);
}

//triggerSoundAfter(-1,1,500);


out_trigger_sound_function = triggerSoundAfter;

just_rotate_function = just_rotate;


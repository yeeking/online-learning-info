const midi = require('midi');
const OBSWebSocket = require('obs-websocket-js');
 
const input = new midi.Input();
const obs = new OBSWebSocket();

const note_to_scene = {42:"Start", 44:"Code", 46:"Slides", 34:"Computers", 36:"Video commentary"}

// set up ws
obs.connect({ address: 'localhost:4444', password: 'mypassword' });

// set up midi
input.getPortCount();
 
// Get the name of a specified input port.
input.getPortName(0);
 
// Configure a callback.
input.on('message', (deltaTime, message) => {
  console.log(`m: ${message} d: ${deltaTime}`);
  if (message[0] == 144) // note on
  {
    console.log('Note on : '+message[1]);
    if (note_to_scene[message[1]] != undefined)
    {
      console.log(note_to_scene[message[1]]);
      obs.send('SetCurrentScene', {'scene-name':note_to_scene[message[1]]});
    }
    if (message[1] == 34)
    {
//      shutdownMidi();
    } 
  }
});
 
// Open the first available input port.
input.openPort(0);
 
input.ignoreTypes(false, false, false);

function shutdownMidi(){ 
  console.log('exiting');
  input.closePort();
  process.exit(0);
}

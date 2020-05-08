# MIDI to websocket obs 

This is a simple node program that takes MIDI notes in from whatever MIDI device is connected and sends them over to the OBS websocket server as scene switching messages. It is configured to switch scenes when you send MIDI notes. 

It uses this plugin to create the websocket access to OBS:

https://github.com/Palakis/obs-websocket

Could probably hack that into a MIDI receiver, but this was quicker. 

## Running:

Run:

```
  npm install
  node midi_ws.js
```



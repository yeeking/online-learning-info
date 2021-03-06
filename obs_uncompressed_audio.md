# Audio notes

Some notes on audio.

OBS is great, but if you want to get your audio up to scratch, you need to extract the audio track from the video file generated by OBS and process it separately. 

## Extracting audio with ffmpeg

It is easy to rip the audio track from a video file with ffmpeg. Let's say you have a file called original_audio_video.mp4 and you want to rip the audio track to a file called original_audio.wav. Do this:

```
    ffmpeg -i original_audio_video.mp4 original_audio.wav
```

Do your work on original_audio.wav - normalise it, run it through a compressor etc. Be careful not to change the length, sample rate or format of the file when you save it back out. Say you saved it back out as fixed_audio.wav. Then you can swap it out with the original audio track like this:

```
    ffmpeg -i original_audio_video.mp4 -i fixed_audio.wav -c:v copy  -map 0:v:0 -map 1:a:0 fixed_audio_video.mp4
```

Some notes:

* there are two -i arguments, one for the original video file, one for the fixed audio file
* -c:v copy means we copy the original video across, it is not re-encoded
* -map 0:v:0 maps the video track on the first input to the video track on the output
* -map 1:a:0 means map the audio track on the second input to the audio track on the first output (I think)
* we do not specify the audio codec, so it will use the default settings to re-encode the audio from wav to mp4. On my system, I ended up with this audio track (ffprobe fixed_audio_video.mp4) 

```
    Stream #0:1(und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 128 kb/s (default)
```

You might want to up the bitrate a bit on the audio:

```
    ffmpeg -i original_audio_video.mp4 -i fixed_audio.wav -c:v copy -b:a 192k  -map 0:v:0 -map 1:a:0 fixed_audio_video.mp4
```

That's great, but the problem is that the audio track is compressed, so when you extract it, it will go through a de-compression process. Eventually, you'll put that audio track back onto the video file which involves a further compression phase. So if you think about the path the audio has taken:

* it is compressed once when you first captured it
* it is decompressed when you convert it to a wav
* it is compressed when you put it back onto the ideo 

It would be much better if we could reduce the number of decompression and recompression steps. To do that, you need to capture uncompressed audio on your video track. You can set this up in the advanced output settings of OBS. 

Do this:

* Go into OBS settings
* Go into Output
* Select output mode advanced
* Go to the recording tab
* For type, Select Custom output ffmpeg
* For container format select mastroska (this container can handle uncompressed audio tracks, unlike the mp4 one)
* Set your video bitrate to what you want - the basic setting mp4/indistinguishable quality generates 25000kbps I think
* Now set the audio encoder to pcm_24le. That's 24 bit uncompressed. 
* You can also select which audio tracks you want here. I found that just selecting '1' gave me a single, stereo audio track on the output. In the 'advanced audio settings' section, accessible from a right click on the mixer on the main OBS panel, you can configure where your audio tracks are sent. 
* If you want, go back out to the audio section in the main settings, and set the sample rate to 48KHz


Now when you record, you will get an uncompressed audio track on your file. You will also notice that the video extension changes to mkv, for the mastroska container. 

Now you can extract the pure audio track like this, assuming you have a video file called uncomp_audio_video.mkv:

```
   ffmpeg -i uncomp_audio_video.mkv -c copy uncomp_audio.wav
```

Do your work on uncomp_audio.wav, save it as uncomp_audio_new.wav. Now you can replace the audio on the video like this:

```
    ffmpeg -i uncomp_audio_video.mkv -i uncomp_audio_new.wav -c:v copy -c:a copy  -map 0:v:0 -map 1:a:0 uncomp_audio_video_new.mkv
```

Note that I did not compress the audio in this example. I'm assuming you will be loading the video file into a video editor so best to maintain the audio quality for now. 









 



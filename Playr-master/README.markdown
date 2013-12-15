# Playr: yet another HTML5 &lt;video&gt; player

## License

MIT License 

## Compatibility

All major browsers.

## Features

* Easy integration
* Multiple [SubRip](http://en.wikipedia.org/wiki/SubRip) / [WebVTT](http://www.delphiki.com/webvtt/) tracks support
* Keyboard accessible
* True fullscreen

## Notes on local testing

Some browsers disable XMLHttpRequest on local files by default.

* Opera: enable opera:config#UserPrefs|AllowFileXMLHttpRequest
* Chrome: launch it with --allow-file-access-from-files

## Usage

Just add the class name "playr_video" to your video tag:

	<video src="myVideo.ext" class="playr_video">
		<track kind="subtitles" label="English Subtitles" srclang="en" src="mySubs.srt" /> // optional
	</video>

You can now force the caption rendering if you prefer to use Playr's rendering over the native one, by adding the following attribute:

	<video ... data-rendering="playr">

## WebVTT implementation

Working features:

* Track kinds:
	* subtitles
	* captions
	* descriptions
	* chapters
* Text position
* Text alignment
* Text size
* Vertical text (incompatible with other cue settings)
* Line position
* Class tags
* Cue timestamps tags

Note on cue timestamps:

	00:00:17,556 --> 00:00:20,631
	Can you hear it?
	<00:00:18,556>The noise, <00:00:19,600>the drumbeat?
	
::cue:past & ::cue:future are remplaced with the CSS classes playr_cue_past & playr_cue_future.
They're not defined by default. Customize them as you wish.

## Keyboard

* <button>Tab</button> : switch between controls
* <button>↑</button> : volume up
* <button>↓</button> : volume down
* <button>←</button> : rewind
* <button>→</button> : forward
* <button>f</button> : toggle fullscreen
* <button>x</button> : delay subtitles (-500 ms)
* <button>c</button> : delay subtitles (+500 ms)
* <button>d</button> : default subtitles sync

## Demos

See demos [on the project page](http://www.delphiki.com/html5/playr/).

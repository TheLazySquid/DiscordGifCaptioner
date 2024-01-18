# Discord Gif Captioner

This is a [BetterDiscord](https://betterdiscord.app/) plugin that adds a way to add a custom caption to a tenor gif from directly within discord. Gifs inside the gif picker will have a new button at the top left that will open a dialog to create a custom caption.

![Caption Dialog](/images/addCaption.png)

After completing this, the gif will be rendered with the caption and sent to the channel you are currently in.

This plugin is powered by a lobotomized version of [gif.js](https://github.com/jnordberg/gif.js) that has been modified to only run on a single thread.

## Installation

To install, download the plugin [here](/build/GifCaptioner.plugin.js) and put it in your BetterDiscord plugins folder.

## Quality

The quality of captioned gifs will sometimes be a bit lower than the original. This is because tenor does not acutally use gifs, but rather looped MP4s. Converting to a gif will often result in a loss of quality.

## Notes

This only works with actual Tenor gifs- other gifs that you have favorited will not work.
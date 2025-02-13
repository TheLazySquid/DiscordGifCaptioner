> [!CAUTION]
> This plugin has been moved to my [new plugin repository](https://github.com/TheLazySquid/BetterDiscordPlugins/tree/main/plugins/GifCaptioner). Changes will no longer be reflected here, and this repository may be removed in the future.

# Discord Gif Captioner

This is a [BetterDiscord](https://betterdiscord.app/) plugin that adds a way to add a custom caption to a tenor gif from directly within discord. Gifs inside the gif picker will have a new button at the top left that will open a dialog to create a custom caption.

![Caption Dialog](/images/addCaption.png)

After completing this, the gif will be rendered with the caption and sent to the channel you are currently in.

This plugin is powered by a lobotomized version of [gif.js](https://github.com/jnordberg/gif.js) that has been modified to only run on a single thread.

## Installation

To install, download the plugin [here](/build/GifCaptioner.plugin.js) and put it in your BetterDiscord plugins folder.

## Quality

The quality of captioned gifs will sometimes be a bit lower than the original. This is because tenor does not acutally use gifs, but rather looped MP4s. Converting to a gif will often result in a loss of quality.
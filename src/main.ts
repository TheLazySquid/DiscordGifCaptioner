import GIF from './gif.js/gif'
// @ts-ignore
import futura from '../assets/Futura Condensed Extra Bold.otf';
// @ts-ignore
import css from '../assets/styles.css'
// @ts-ignore
import CaptionBtnSVG from '../assets/page-layout-header.svg'
import { getLines } from './util';
import captionCreator from './captionCreator.jsx'
import { watchElement, onStart, onStop } from 'lazypluginlib'
import { decompressFrames, ParsedFrame, ParsedGif, parseGIF } from 'gifuct-js';

let rendering: boolean = false

type Gif = HTMLVideoElement | HTMLImageElement;

const gifSelector = "video[class^='gif'], img[class^='gif']"
watchElement(gifSelector, (gif) => {
    if(gif.querySelector(".gif-captioner-btn")) return
    
    let captionBtn = document.createElement("button")
    captionBtn.innerHTML = CaptionBtnSVG
    captionBtn.classList.add("gif-captioner-btn")
    gif.before(captionBtn)
    
    BdApi.UI.createTooltip(captionBtn, "Add Custom Caption", {})

    let isVideo = gif.nodeName === "VIDEO";
    
    captionBtn.addEventListener('click', async (e) => {
        e.stopPropagation()
        e.preventDefault()
        
        let settings = {caption: '', fontSize: 35}
        let src = (gif as Gif).src
        let width: number;
        let parsedGif: ParsedGif | undefined; 

        if(isVideo) width = (gif as HTMLVideoElement).videoWidth;
        else {
            // @ts-ignore types missing for some reason
            let res = await (BdApi.Net.fetch as typeof fetch)(src);
            let buff = await res.arrayBuffer();
            parsedGif = parseGIF(buff);
            width = parsedGif.lsd.width;
        }
    
        const reactEl = BdApi.React.createElement(captionCreator, {
            src,
            width,
            onUpdate: (caption: string, fontSize: string) => {
                settings.caption = caption
                settings.fontSize = parseInt(fontSize)
            },
            isVideo
        })
    
        const onConfirm = () => {
            // close the GIF picker
            renderGif(src, settings.caption, settings.fontSize, isVideo, parsedGif)
            document.querySelector<HTMLButtonElement>(".expression-picker-chat-input-button > button")?.click();
        }
    
        BdApi.UI.showConfirmationModal("Add Caption", reactEl, {
            confirmText: 'Upload',
            cancelText: 'Cancel',
            onConfirm
        })
    })
})

function getChannelId() {
    const channelID = location.href.split("/").pop()
                        
    // make sure channelID is a number
    if(isNaN(Number(channelID))) return null
    return channelID
}

let font = new FontFace("futuraBoldCondensed", futura)

export const imgAdder: any = Object.values(BdApi.Webpack.getModule(module => Object.values<any>(module)?.[0]?.addFile))[0];
export const chatKeyHandlers = BdApi.Webpack.getModule((exports) => Object.values<any>(exports)?.[0]?.
    toString?.().includes("selectNextCommandOption"))
let submitMessage: Function;

onStart(() => {
    document.fonts.add(font)
    BdApi.Patcher.before("GifCaptioner", chatKeyHandlers, Object.keys(chatKeyHandlers)[0], (_, args: any) => {
        submitMessage = args[0].submit;
    })
})

onStop(() => {
    document.fonts.delete(font);
    BdApi.Patcher.unpatchAll("GifCaptioner")
})

function uploadFile(channelId: string, file: File) {
    // add the GIF to the message
    imgAdder.addFile({
        channelId,
        draftType: 0,
        showLargeMessageDialog: false,
        file: {
            file,
            isThumbnail: false,
            platform: 1
        }
    })

    // send the message
    submitMessage()
}

async function renderGif(originalSrc: string, caption: string, fontSize: number, isVideo: boolean, parsedGif?: ParsedGif) {
    if(rendering) return
    rendering = true

    const channel = getChannelId()
    if(!channel) return

    let progressDialog = document.createElement("dialog")
    progressDialog.id = "progressDialog"
    progressDialog.addEventListener("close", (e) => e.preventDefault())
    progressDialog.innerHTML = `
        <label for="renderProgress">Preparing...</label>
        <progress id="renderProgress" value="0" max="1"></progress> <br />
        <button id="cancelRender">Cancel</button>
    `
    let progress = progressDialog.querySelector("#renderProgress") as HTMLProgressElement
    document.body.appendChild(progressDialog)
    progressDialog.showModal()
    
    let width: number, height: number, frames: number, duration: number;
    let gifFrames: ParsedFrame[] = [];
    let video: HTMLVideoElement;
    if(isVideo) {
        video = document.createElement("video")
        video.src = originalSrc
        video.crossOrigin = "anonymous"
    
        // wait for video to load
        await new Promise((res) => {
            video.addEventListener('canplaythrough', res, { once: true })
        })
        
        // calculate how many frames are in the video
        video.currentTime = 0
        video.playbackRate = 16
        video.play()
        await new Promise((res) => video.addEventListener('ended', res, { once: true }))
        let quality = video.getVideoPlaybackQuality()
        frames = quality.totalVideoFrames
        video.pause()

        width = video.videoWidth
        height = video.videoHeight
        duration = video.duration
    } else {
        gifFrames = decompressFrames(parsedGif!, true);

        width = parsedGif!.lsd.width
        height = parsedGif!.lsd.height
        frames = gifFrames.length

        duration = 0;
        for(let frame of gifFrames) duration += frame.delay
    }
    console.log("Frames:", frames);

    // just in case somehow a gif doesn't have any length
    if(duration == 0) duration = 1
    
    // yeah this is a bit of a mess
    const padding = 10;
    let renderCanvas = document.createElement("canvas") // this could be an OffscreenCanvas but issues
    renderCanvas.width = width
    let renderCtx = renderCanvas.getContext("2d")!
    renderCtx.font = `${fontSize}px futuraBoldCondensed`
    let lines = getLines(renderCtx, caption, renderCanvas.width)
    renderCanvas.height = height + (lines.length * fontSize) + (padding * 2)
    renderCtx.font = `${fontSize}px futuraBoldCondensed`
    renderCtx.textAlign = 'center';
    renderCtx.textBaseline = 'top';

    console.log("Rendering to", renderCanvas.width, "x", renderCanvas.height)

    // scale down the gif to fit within the max size (needs work)
    const maxSize = 10e6 // 10 MB
    const estSize = frames * renderCanvas.width * renderCanvas.height

    console.log("Estimated size:", estSize)

    const factor = Math.max(1, Math.sqrt(estSize / maxSize))
    const newWidth = Math.floor(renderCanvas.width / factor)
    const newHeight = Math.floor(renderCanvas.height / factor)

    console.log("Scaling down by a factor of", factor, "to", newWidth, "x", newHeight)

    let gif = new GIF({
        quality: 10,
        width: newWidth,
        height: newHeight,
    });

    let aborted = false
    progressDialog.querySelector("#cancelRender")!.addEventListener("click", () => {
        if(gif.running) gif.abort()
        aborted = true
        document.body.removeChild(progressDialog)
    })

    gif.on('progress', (e: number) => {
        console.log("Rending progress:", e)
        progress.value = e
    })

    gif.on('finished', (blob: Blob) => {
        rendering = false
        document.body.removeChild(progressDialog)

        console.log("Final size:", blob.size)   

        let file = new File([blob], 'rendered.gif', { type: 'image/gif' })
        uploadFile(channel, file)
    });

    let fps = frames / duration
    let scaledCanvas = document.createElement("canvas")
    let scaledCtx = scaledCanvas.getContext("2d")!
    scaledCanvas.width = newWidth
    scaledCanvas.height = newHeight

    progressDialog.querySelector("label")!.innerHTML = "Rendering..."

    renderCtx.fillStyle = "white"
    renderCtx.fillRect(0, 0, renderCanvas.width, renderCanvas.height)

    renderCtx.font = `${fontSize}px futuraBoldCondensed`
    renderCtx.fillStyle = "black"
    for(let i = 0; i < lines.length; i++) {
        renderCtx.fillText(lines[i], renderCanvas.width / 2, i * fontSize + padding)
    }

    const captionHeight = (lines.length * fontSize) + (padding * 2)

    let tempC = document.createElement("canvas")
    let tempCtx = tempC.getContext("2d")!
    let frameImageData: ImageData | undefined;
    let needsDisposal = false;

    for(let frame = 0; frame < frames; frame++) {
        if(aborted) break

        if(needsDisposal) {
            renderCtx.clearRect(0, captionHeight, renderCanvas.width, renderCanvas.height);
            needsDisposal = false;
        }

        if(isVideo) {
            video!.currentTime = frame * 1 / fps + Number.MIN_VALUE
            await new Promise((res) => video.addEventListener('seeked', res, { once: true }))
    
            renderCtx.drawImage(video!, 0, captionHeight)
        } else {
            let gifFrame = gifFrames[frame];

            if(gifFrame.disposalType == 2) {
                needsDisposal = true;
            }

            // copied from gifuct-js demo
            if(
                !frameImageData ||
                gifFrame.dims.width != frameImageData.width ||
                gifFrame.dims.height != frameImageData.height
            ) {
                tempC.width = gifFrame.dims.width;
                tempC.height = gifFrame.dims.height;
                frameImageData = tempCtx.createImageData(gifFrame.dims.width, gifFrame.dims.height);
            }
            
            frameImageData.data.set(gifFrame.patch);
            tempCtx.putImageData(frameImageData, 0, 0);

            renderCtx.drawImage(tempC, gifFrame.dims.left, gifFrame.dims.top + captionHeight);
        }

        scaledCtx.drawImage(renderCanvas, 0, 0, newWidth, newHeight)

        if(isVideo) {
            gif.addFrame(scaledCtx, { delay: 1 / fps * 1000, copy: true })
        } else {
            gif.addFrame(scaledCtx, { delay: gifFrames[frame].delay, copy: true })
        }

        progress.value = frame / frames
    }

    progressDialog.querySelector("label")!.innerHTML = "Encoding..."

    gif.render()
}

onStart(() => {
    BdApi.DOM.addStyle("gif-captioner-style", css)
})

onStop(() => {
    BdApi.DOM.removeStyle("gif-captioner-style")

    // cleanup any buttons that were added
    let btns = document.querySelectorAll(".gif-captioner-btn")
    for(let btn of btns) {
        btn.remove()
    }
})
import { getLines } from './util.ts';

const React = BdApi.React;
const { useState, useEffect, useRef } = React;

export default function CaptionCreator({ src, width, onUpdate }) {
    const padding = 10;
    const [caption, setCaption] = useState('');
    const [fontSize, setFontSize] = useState(35);
    const canvasRef = useRef(null);

    function rerender() {
        onUpdate(caption, fontSize)

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.font = `${fontSize}px futuraBoldCondensed`;
        const lines = getLines(ctx, caption, width);
        
        canvas.height = lines.length * fontSize + padding * 2;
        ctx.font = `${fontSize}px futuraBoldCondensed`;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
    
        for(let line = 0; line < lines.length; line++) {
            ctx.fillText(lines[line], width / 2, line * fontSize + padding);
        }
    }

    useEffect(rerender, [caption, fontSize]);

    return (
        <div className="caption-creator">
            <div className="settings">
                <input 
                    className="caption-input"
                    type="text" 
                    placeholder="Caption" 
                    onChange={e => setCaption(e.target.value)} 
                />
                <label htmlFor="font-size-slider">Font Size</label>
                <input
                    id="font-size-slider" 
                    className="font-size-slider"
                    type="range" 
                    min="5" 
                    max="100" 
                    defaultValue="35"
                    onChange={e => setFontSize(e.target.value)}
                />
            </div>
            <div className='caption-preview'>
                <canvas className="caption-canvas" ref={canvasRef} width={width} height={padding * 2} />
                <video className="caption-video" src={src} loop muted autoPlay />
            </div>
        </div>
    );
}
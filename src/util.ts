// https://stackoverflow.com/questions/2936112/text-wrap-in-a-canvas-element
export function getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    var words = text.split(" ");
    var lines: string[] = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

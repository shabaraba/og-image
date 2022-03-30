
import { readFileSync } from 'fs';
import { marked } from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, fontSize: string, bg: string) {
    let background = 'white';
    let foreground = 'black';
    let radial = 'lightgray';

    if (theme === 'dark') {
        background = 'black';
        foreground = 'white';
        radial = 'dimgray';
    }
    let backgroundCss = `
        background: ${background};
        background-image: radial-gradient(circle at 25px 25px, ${radial} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${radial} 2%, transparent 0%);
        background-size: 100px 100px;
    `;
    if (bg !== '') {
        backgroundCss = `
            background-image: url(${bg});
            background-color:rgba(255,255,255,0.3);
            background-blend-mode:lighten;
            background-size: cover;
            background-position : center center;
        `;
    }

    return `
    @import url('https://fonts.googleapis.com/css?family=M+PLUS+1p');
    @import url('https://cdn.jsdelivr.net/npm/yakuhanjp@3.4.1/dist/css/yakuhanjp_s.min.css');
    @import url('https://fonts.googleapis.com/css2?family=Caveat&display=swap');

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    body {
        ${backgroundCss}
        height: 100vh;
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: center;
        position:relative;
    }

    code {
        color: #D400FF;
        font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .logo-wrapper {
        display: float;
        // align-items: center;
        // align-content: center;
        // justify-content: center;
        // justify-items: center;
    }

    .logo {
        margin: 0 75px;
    }

    .plus {
        color: #BBB;
        font-family: Times New Roman, Verdana;
        font-size: 100px;
    }

    .spacer {
        width: 65%;
        height: 65%;
        padding-top: 50px;
        padding-bottom: 50px;
        padding-right: 100px;
        padding-left: 100px;
        background: rgba(232,207,193, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }
    
    .logo-text {
        font-family: 'Caveat', cursive;
        font-size: 150px;
        color: ${foreground};
        transform: rotate(-5deg);
        position: absolute;
        bottom: -50px;
        right: 100px;
        filter: drop-shadow(6px 3px 1.5px #fcfcfc);
    }

    .heading {
        font-family: YakuHanJPs,'M PLUS 1p', 'Inter', sans-serif;
        font-size: ${sanitizeHtml(fontSize)};
        font-style: normal;
        color: ${foreground};
        line-height: 1.2;
        word-wrap: break-word;
        width: 100%;
    }

    .image-body {
        position: relative;
        height: 100vh;
        width: 100vw;
    }
  `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, theme, md, fontSize, images, siteTitle, bg, widths, heights } = parsedReq;
    return `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.3/dist/katex.min.css" integrity="sha384-ThssJ7YtjywV52Gj4JE/1SQEDoMEckXyhkFVwaf4nDSm5OBlXeedVYjuuUd0Yua+" crossorigin="anonymous">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.3/dist/katex.min.js" integrity="sha384-Bi8OWqMXO1ta+a4EPkZv7bYGIes7C3krGSZoTGNTAnAn5eYQc7IIXrJ/7ck1drAi" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.13.3/dist/contrib/auto-render.min.js" integrity="sha384-vZTG03m+2yp6N6BNi5iM4rW4oIwk5DfcNdFfxkk9ZWpDriOkXX8voJBFrAO7MpVl" crossorigin="anonymous"
        onload="renderMathInElement(document.body);"></script>
    </head>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        ${getCss(theme, fontSize, bg)}
    </style>
    <body>
        <div class="spacer">
            <div class="logo-wrapper">
                ${images.map((img, i) =>
                    getPlusSign(i) + getImage(img, widths[i], heights[i])
                ).join('')}
            </div>
            <div class="heading">${emojify(
                md ? marked(text) : sanitizeHtml(text)
            )}
            </div>
            <div class="logo-text">${emojify(
                md ? marked(siteTitle) : sanitizeHtml(siteTitle)
            )}
            </div>
        </div>
    </body>
</html>`;
}

function getImage(src: string, width ='auto', height = '225') {
    return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`
}

function getPlusSign(i: number) {
    return i === 0 ? '' : '<div class="plus">+</div>';
}

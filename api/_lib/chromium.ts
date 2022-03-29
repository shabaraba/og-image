import core from 'puppeteer-core';
import { getOptions } from './options';
import { FileType } from './types';
let _page: core.Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await core.launch(options);
    _page = await browser.newPage();
    return _page;
}


export async function getScreenshot(html: string, type: FileType, isDev: boolean) {
    const page = await getPage(isDev);
    await page.setViewport({ width: 2048, height: 1170 });
    await page.setExtraHTTPHeaders({
        'Accept-Language': 'ja-JP'
    });
    await page.setContent(html);

    const sleep = (waitTime: number) => new Promise( resolve => setTimeout(resolve, waitTime) );
    await sleep(500); // フォント反映に時間がかかる場合がある？ので少し待つ
    const file = await page.screenshot({ type });
    return file;
}

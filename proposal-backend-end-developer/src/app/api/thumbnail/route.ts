import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

export async function POST(request: Request, response: Response) {
    const browser = await puppeteer.launch({ headless: true });
    try {
        const body = await request.json();
        const { html } = body;

        const [page] = await browser.pages();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 1280, height: 1024 });
        const binaryScreenshot = await page.screenshot({
            type: 'png',
            encoding: 'binary',
        });
        const result = await sharp(binaryScreenshot)
            .resize(700, 200, { fit: sharp.fit.inside }).png().toBuffer();
        // call external api to upload the image
        return NextResponse.json({ message: 'action performed' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    } finally {
        await browser.close();
    }
}
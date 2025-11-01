import * as cheerio from 'cheerio';

export default async function handler(req, res){
    const pageUrls = req.body.pages;
    // let summaries = [];

    // console.log("PageURLS:", typeof(pageUrls), pageUrls);

    const texts = await Promise.all(
        pageUrls.map(async (page) => {
            const res = await fetch(page.url);
            const html = await res.text();
            const $ = cheerio.load(html);
            const paragraphs = $('p');
            let textA = [];
            const p_text = paragraphs.each((i, pElement) => textA.push($(pElement).text().replace(/\s+/g, ' ').trim()));
            // console.log("TEXT ARRAY:", textA);
            // const text = $.text().replace(/\s+/g, ' ').trim();
            return textA.join(" ");
        })
    )

    console.log("TEXTS:", texts);

    res.send(JSON.stringify(texts));
}
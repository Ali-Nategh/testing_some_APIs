import cheerio from 'cheerio';
import axios from'axios';

import express from'express'
const app = express();

import { translate } from '@vitalets/google-translate-api';

import createHttpProxyAgent from'http-proxy-agent';


// Scraping proxies list
const url = "https://free-proxy-list.net/"
async function getProxyList(){
    let proxies = [];
    try {
        const response = await axios.get(url, {headers: {"Accept-Encoding":"gzip,deflate,compress"}});

        const $ = cheerio.load(response.data);
        const list = $("#list > div > div.table-responsive > div > table > tbody");

        list.children().each(function(){
            let proxy_info = [];
            let row = $(this).children();
            row.each(function(){
                proxy_info.push($(this).text());
            })
            // only using anonymous ones
            if (proxy_info[4] == 'anonymous') {
                proxies.push(proxy_info);
            }
        });
        return(proxies);
    } 
    catch (error) {
        console.error(error);
        return [];
    }
}


let translate_text = `
Any Error object has a stack member that traps the point at which it was constructed.
        
var stack = new Error().stack
console.log( stack )
or more simply:

console.trace("Here I am!")
`
let translated_texts = [];

async function translateWithProxies(){
    let proxies = await getProxyList();
    
    for (let i = 1; i < proxies.length; i++) {
        console.log("test: " + i);
        const ip = proxies[i][0];
        const port = proxies[i][1];
        console.log(`http://${ip}:${port}`);
        let agent = await createHttpProxyAgent(`http://${ip}:${port}`);

        // some delay to fix errors?
        // const delay = ms => new Promise( res => setTimeout(res, ms));
        // await delay(1500)
        

        try {
            let text = await translate(`${translate_text}`,{
                from: 'en',
                to: 'fa',
                fetchOptions: { agent },
                // forceBatch: false
            });
            text = text.text
            translated_texts.push(text);
            console.log(text);
        } catch (e) {
            console.log(e);
            continue;
            // if (e.name === 'TooManyRequestsError') {
            // }
        }
    }
}


translateWithProxies()


// To see translated content on localhost:5000
app.get('/', function(req, res) {
    res.send(`${translated_texts}`);
});


app.listen(5000)
console.log('listening on 5000')
import cheerio from 'cheerio';
import axios from'axios';

import express from'express'
const app = express();

import { translate } from '@vitalets/google-translate-api';

import createHttpProxyAgent from'http-proxy-agent';



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
            proxies.push(proxy_info);
            // if (proxy_info[4] == 'anonymous') {
            // }
        });
        return(proxies);
    } 
    catch (error) {
        console.error(error);
        return [];
    }
}


let translate_now = `
Any Error object has a stack member that traps the point at which it was constructed.
        
var stack = new Error().stack
console.log( stack )
or more simply:

console.trace("Here I am!")`
let translated_text = [];

async function translateWithProxies(){
    let proxies = await getProxyList();
    
    for (let i = 1; i < proxies.length; i++) {
        console.log("loopin" + i);
        const ip = proxies[i][0];
        const port = proxies[i][1];
        console.log(`http://${ip}:${port}`);
        let agent = await createHttpProxyAgent(`http://${ip}:${port}`);

        const delay = ms => new Promise( res => setTimeout(res, ms));
        // await delay(1500)
        
        

        try {
            let text = await translate(`${translate_now}`,{
                from: 'en',
                to: 'fa',
                fetchOptions: { agent },
                // forceBatch: false
            });
            text = text.text
            translated_text.push(text);
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


app.get('/', function(req, res) {
    res.send(`${translated_text}`);
});


app.listen(5000)
console.log('listening on 5000')
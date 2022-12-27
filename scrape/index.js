const cheerio = require('cheerio')
const axios = require('axios')

const createHttpProxyAgent = require('http-proxy-agent');


const url = "https://free-proxy-list.net/"


async function getProxyList(){
    let proxies = []
    try {
        const response = await axios.get(url, {headers: {"Accept-Encoding":"gzip,deflate,compress"}});

        const $ = cheerio.load(response.data);
        const list = $("#list > div > div.table-responsive > div > table > tbody");

        list.children().each(function(){
            let proxy_info = []
            let row = $(this).children()
            row.each(function(){
                proxy_info.push($(this).text())
            })
            if (proxy_info[4] == 'anonymous') {
                proxies.push(proxy_info)
            }
        });
        return(proxies);
    } 
    catch (error) {
        console.error(error);
        return []
    }
}


async function connectToProxies(){
    let proxies = await getProxyList()
    console.log(proxies)
    
    for (i = 0; i < proxies.length; i++) {
        console.log("loopin" + i)
        const ip = proxies[i][0]
        const port = proxies[i][1]
        const agent = createHttpProxyAgent(`http://${ip}:${port}`);
    }
}

connectToProxies()

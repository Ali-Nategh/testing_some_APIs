import axios from 'axios';
import cheerio from 'cheerio';

// import express from 'express'
// const app = express();


let action = "answers" // answers questions
let sort = "sort=activity" // activity creation votes
let order = "order=desc" // asc desc
let site = "site=stackoverflow"
const url = `https://api.stackexchange.com/2.3/${action}?${sort}&${order}&${site}`
// answers?order=desc&sort=activity&site=stackoverflow

async function getInfoFromStackOverflow(){
    let info = [];
    try {
        const response = await axios.get(url, {headers: {"Accept-Encoding":"gzip,deflate,compress"}});

        console.log(response.data);
        // const $ = cheerio.load(response.data);
        // const list = $("");
        // console.log($)
    } 
    catch (error) {
        console.error(error);
        return [];
    }
}

getInfoFromStackOverflow()

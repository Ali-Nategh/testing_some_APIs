import { translate } from '@vitalets/google-translate-api';
import express from 'express'
const app = express();

import createHttpProxyAgent from 'http-proxy-agent';

const agent = createHttpProxyAgent('http://130.185.225.240:3128');


let text = ''
try {
    text = await translate(`
    Any Error object has a stack member that traps the point at which it was constructed.

    var stack = new Error().stack
    console.log( stack )
    or more simply:
    
    console.trace("Here I am!")
    `
    ,{ 
        from: 'en',
        to: 'fa',
        // fetchOptions: { agent },
        // forceBatch: false 
    });
    text = text.text
} catch (e) {
    if (e.name === 'TooManyRequestsError') {
        console.error(e);
        // retry with another proxy agent
    }
}


app.get('/', function(req, res) {
    res.send(`${text}`);
});


console.log("\n------------\n" + text + "\n------------\n") // => 'Hello World! How are you?' d



app.listen(5000)
console.log('listening on 5000')
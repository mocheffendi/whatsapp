const { Client, Location, List, Buttons, LocalAuth } = require('./index');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    // proxyAuthentication: { username: 'username', password: 'password' },
    puppeteer: {
        // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
        headless: true
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

// client.on('qr', (qr) => {
//     // NOTE: This event will not be fired if a session is specified.
//     console.log('QR RECEIVED', qr);
// });

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});
// const { Client, LocalAuth } = require('whatsapp-web.js');


const express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
// const Article = require('./models').Article;

let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     // // proxyAuthentication: { username: 'username', password: 'password' },
//     puppeteer: {
//         // args: ['--proxy-server=proxy-server-that-requires-authentication.example.com'],
//         headless: false
//     }
//     // puppeteer: {
//     //     handleSIGINT: false,
//     //     headless: false,
//     //     args: [
//     //         '--no-sandbox',
//     //         '--disable-setuid-sandbox'
//     //     ]
//     // }
// });

// Function to handle the root path
app.get('/', async function (req, res) {

    let number = req.query.number; // "+911234567890";
    // Your message.
    let text = req.query.text; // "Hey john";
    // const text = "Hello World ...";

    // Getting chatId from the number.
    // we have to delete "+" from the beginning and add "@c.us" at the end of the number.
    // const chatId = number.substring(1) + "@c.us";

    // Sending message.
    // client.sendMessage(chatId, text);

    // const number = "9830121234";
    // const sanitized_number = number.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
    // const final_number = `62${sanitized_number.substring(sanitized_number.length - 12)}`; // add 91 before the number here 91 is country code of India

    // const number_details = await client.getNumberId(final_number); // get mobile number details

    // client.isRegisteredUser("911234567890@c.us").then(function(isRegistered) {
    //     if(isRegistered) {
    //         client.sendMessage("911234567890@c.us", "hello");
    //     }
    // })

    client.isRegisteredUser(number + "@c.us")
        .then(function (isRegistered) {
            if (isRegistered) {
                client.sendMessage(number + "@c.us", text);
            } else {
                console.log("number not registered");
            }
        })
        .catch((error) => {
            console.error(error);
        });

    // console.log(sanitized_number);
    console.log(number);

    // if (number_details) {
    //     const sendMessageData = await client.sendMessage(number_details._serialized, sendData.text); // send message
    // } else {
    //     console.log(final_number, "Mobile number is not registered");
    // }

    // let articles = await Article.findAll().paginate({ page: page, limit: limit }).exec();

    // // Return the articles to the rendering engine
    // res.render('index', {
    //     articles: articles
    // });
    // res.send({ Status: 'Message Delivered' });
    res.setHeader('Content-Type', 'text/html');
    // res.write('<h3>Status : Message Delivered </h3>');
    // res.send("<script>window.close();</script > ");
    res.write('<h3>Status : Message Delivered </h3><script>var delay = (function () {var timer = 0;return function (callback, ms) {clearTimeout(timer);timer = setTimeout(callback, ms);};})();delay(function () {window.close();}, 2000);</script >');
    res.end();
});

let server = app.listen(8080, function () {
    console.log('Server is listening on port 8080')
});
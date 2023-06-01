const express = require('express');
const fetch = require('node-fetch');
const request = require('request');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.render("index");
    });

app.post('/convert', async (req, res) => {
    const videoURL = req.body.videoURL;
    if (
        videoURL === null ||
        videoURL === undefined ||
        videoURL === ''
    ) {
        return res.render("index", {success : false, message : "Niste unijeli link!"});
    } else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoURL}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === 'ok') 
            return res.render("index", {success : true, song_title : fetchResponse.title, song_link : fetchResponse.link});
        else 
            return res.render("index", {success : false, message : fetchResponse.message});
    }  
});

app.listen(PORT, () => {
    console.log(`Pokrecem server na portu ${PORT}`);
    });
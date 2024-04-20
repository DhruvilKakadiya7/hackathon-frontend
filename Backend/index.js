const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const Replicate  = require("replicate");
const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

app.get('/',async (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/getAudio' ,async (req,res) =>  {
    console.log('okay');
    const output = await replicate.run(
        "lucataco/sadtalker:85c698db7c0a66d5011435d0191db323034e1da04b912a6d365833141b6a285b",
        {
          input: {
            still: true,
            enhancer: "gfpgan",
            preprocess: "full",
            driven_audio: "https://replicate.delivery/pbxt/Jf1gczNATWiC94VPrsTTLuXI0ZmtuZ6k0aWBcQpr7VuRc5f3/japanese.wav",
            source_image: "https://replicate.delivery/pbxt/Jf1gcsODejVsGRd42eeUj0RXX11zjxzHuLuqXmVFwMAi2tZq/art_1.png"
          }
        }
      );
      console.log(output);
    res.send(output);
});

app.listen(3000, () => {
  console.log('listening on *:3000');
});
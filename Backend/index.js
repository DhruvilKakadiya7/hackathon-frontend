import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import axios from 'axios';
import Replicate from 'replicate';
import interviewRouter from './route/interview.route.js';
import cookieParser from 'cookie-parser';
const app = express();
import dotenv from 'dotenv';
import AIRouter from './route/shortlist.route.js';
import LoginRouter from './route/login.router.js';
dotenv.config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); 
app.use('/iv', interviewRouter);
app.use('/ai', AIRouter);
app.use('/auth', LoginRouter);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb+srv://hackathon:hackathon@cluster0.1pqceio.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log("DataBase connection successful")
  })
  .catch((e) => { console.log("Database err " + e) }); 
  
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

app.listen(5000, () => {
  console.log('listening on *:3000');
});
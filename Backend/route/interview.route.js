// import axios from 'axios';
import express from 'express';
import questionsModel from '../schema/questionsSchema.js';
import responseModel from  '../schema/interviewSchema.js';

const interviewRouter = express.Router();

const questions = [
    {question: 'Tell me about yourself', videoUrl: 'https://res.cloudinary.com/dbrtxsu3f/video/upload/v1713614048/rcxapd1op5q4jeggjlit.mp4'},
    {question: 'Tell me about yourself2', videoUrl: 'https://res.cloudinary.com/dbrtxsu3f/video/upload/v1713614048/rcxapd1op5q4jeggjlit.mp4'},
]

interviewRouter.get('/uploadQuestions', async(req, res) => {
    await questionsModel.insertMany(questions);
    res.send('ok');
});

interviewRouter.get('/getQuestions', async(req, res) => {
    const data = await questionsModel.find({});
    res.json({data: data});
});

interviewRouter.post('/uploadResponses', async(req, res) => {
    const {email, answers} = req.body;
    const data = await responseModel.insertMany([{email, answers}]);
    res.json({data: data});
});

export default interviewRouter;
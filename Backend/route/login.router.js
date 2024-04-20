import express from 'express';
import questionsModel from '../schema/questionsSchema.js';
import responseModel from  '../schema/interviewSchema.js';
import userMdel from '../schema/userSchema.js';

const LoginRouter = express.Router();

LoginRouter.post('/login', async(req, res)=>{
    const {email, password} = req.body;
    const data = userMdel.find({email: email});
    if(data.length > 0) {
        if(data[0].password == password){
            res.json({status: true});
        }
        else {
            res.json({status: false});
        }
    }
    else {
        res.json({status: false});
    }
});

LoginRouter.post('/signup', async(req, res)=>{
    const {email, password} = req.body;
    const data = userMdel.find({email: email});
    if(data.length > 0) {
        res.json({status: false, message: 'Email already in use!'});
    }
    else {
        await userMdel.insertMany([{email, password}]);
        res.json({status: true, message: 'Logged in succesfully'});
    }
});

export default LoginRouter;
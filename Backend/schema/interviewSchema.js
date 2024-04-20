import mongoose from 'mongoose';

const interviewSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    answers: {
        type: Object,
    }, 
});

export default mongoose.model("responses", interviewSchema); 
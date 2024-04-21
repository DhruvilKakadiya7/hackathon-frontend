import React from 'react'
import { CSVLink } from "react-csv";
import './index.css';

function Feedback() {
    const name = localStorage.getItem('name');
    const uni = localStorage.getItem('interviewId');
    let data = JSON.parse(localStorage.getItem('dataList'));
    let scores = JSON.parse(localStorage.getItem('scores'));
    for (let i = 0; i < data.length; i++){
        data[i]['score'] = scores[i];
    }
    const csvData = [
        ["Question", "Answer", "Score out of 10"],
        ...data.map(({ question, answer, score }) => [
            question,
            answer,
            score
        ]),
    ];
    console.log(data);
    console.log(csvData);
    return (
        <>
            <div className='w-full text-center h-[100vh] flex items-center flex-col justify-center font-bold'>
                <div>{`Thank you, ${name} for your time. Here's the data of your responses`}</div>
                <CSVLink className="downloadbtn mt-3" filename="my-file.csv" data={csvData}>Download</CSVLink>
            </div>
        </>
    )
}

export default Feedback
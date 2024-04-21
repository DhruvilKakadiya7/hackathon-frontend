import React, { useState } from 'react';
import { Button, TextField, MenuItem, InputLabel, FormControl } from '@mui/material';
import Select from '@mui/material/Select';
import { json, useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
function Dashboard() {
    const navigateTo = useNavigate();
    const [name, setName] = React.useState('');
    const [institutionName, setInstitutionName] = React.useState('');
    const [graduationYear, setGraduationYear] = React.useState();
    const [questions, setQuestions] = React.useState();
    const uni = uuidv4();

    const submitForm = (e) => {
        e.preventDefault();
        console.log(uni);
        localStorage.setItem('interviewId', uni);
        navigateTo(`/interview/${uni}`);
    };

    // const handleFileInput = (e) => {
    //     console.log(e.target.value);
    // };

    const handleChange = (e) => {
        setQuestions(e.target.value);
    };

    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleFileInput = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError('Please select a file.');
            return;
        }
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);
        console.log(formData);
        try {
            const response = await fetch('http://localhost:5000/extract-text', {
                method: 'POST',
                body: formData,
            });
            console.log(response.ok);
            if (!response.ok) {
                throw new Error('Error extracting text.');
            }

            const data = await response.json();
            // console.log(data.text);
            setText(data.text);
            const res = await axios.post('http://localhost:8000/ai/getSkills', { text: data.text });
            //   let tmp = await res.json();
            console.log(res.data.text);
            localStorage.setItem('languages', res.data.text);
            localStorage.setItem('name', name);
            setError('');
            localStorage.setItem('interviewId', uni);
            console.log(uni);
            const savedData = await axios.post('http://localhost:8000/iv/saveIV', {interviewId: uni, skills: res.data.text, count: questions});
            navigateTo(`/interview/${uni}`);
        } catch (error) {
            console.error('Error:', error);
            setError('Error extracting text.');
        }
    };
    return (
        <>
            <div className='flex justify-center items-center' style={{ height: '100vh' }}>
                <div className='border-solid border-gray-100 bg-blue-50 rounded-lg border-2 p-10 w-4/12'>
                    <div className='pb-8 text-center tracking-wider font-semibold text-blue-600 text-2xl'>
                        User details form
                    </div>
                    <form className='grid gap-4 ' onSubmit={submitForm}>
                        <TextField
                            id="outlined-basic"
                            label="Name"
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Institution Name"
                            variant="outlined"
                            value={institutionName}
                            onChange={(e) => setInstitutionName(e.target.value)}
                        />
                        <TextField
                            id="outlined-number"
                            label="Graduation Year"
                            type="number"
                            variant="outlined"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(e.target.value)}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{`Technical Questions`}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={questions}
                                label="Technical Questions"
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>0</MenuItem>
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                                <MenuItem value={9}>9</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                            </Select>
                        </FormControl>
                        <input className='my-2' type="file" onChange={handleFileInput} />
                        <Button variant="contained" type='button' onClick={handleSubmit}>
                            Submit
                        </Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
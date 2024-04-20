import axios from 'axios';
import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
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
      console.log(data.text);
      setText(data.text);
      const res = await axios.post('http://localhost:8000/ai/getSkills', {text: data.text});
    //   let tmp = await res.json();
      console.log(res.data.text);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error extracting text.');
    }
  };

  return (
    <div>
      <h1>PDF Text Extractor</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit">Extract Text</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default App;

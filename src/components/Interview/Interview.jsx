import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import './Interview.css';
import video from '../../assets/istockphoto-1578508100-640_adpp_is.mp4';
import { useSpeechRecognition } from 'react-speech-kit';
import axios from 'axios'

const NewQuestion = ({ idx, questions, responses }) => {
  console.log(idx, questions, responses);
  const [value, setValue] = React.useState('');

  return (
    <div className='font-bold mb-3'>
      {`Question-${idx+1}: ${questions[idx].question}`}
    </div>
  );
}

function Interview() {
  const [value, setValue] = React.useState('');
  const [videoEnded, setVideoEnded] = useState(false);
  const [count, setCount] = useState(0);
  const videoRef = React.useRef(null);
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      setValue(result)
    }
  });

  const playVideo = () => {
    videoRef.current.play();
  }
  const [questions, setQuestions] = useState();
  const [loader, setLoader] = useState(true);
  const [components, setComponents] = useState([]);
  const [responses, setResponses] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const handleSave = (responses) => {
    setResponses(responses);
  };

  const addComponent = () => {
    console.log(count, questions[count+1].videoUrl);
    videoRef.current.pause();
    var source = document.getElementById('hr-vdo');
    videoRef.current.load();
    source.setAttribute('src', questions[count+1].videoUrl);
    setVideoUrl(questions[count+1].videoUrl);
    setCount((prev) => prev + 1);
    setResponses([...responses, value]);
    setValue('');
    setComponents([...components,
    <NewQuestion key={components.length} idx={components.length} questions={questions} responses={responses} />
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/iv/getQuestions');
        setQuestions(data.data);
        setVideoUrl(data.data[0].videoUrl);
        setComponents([<NewQuestion key={0} idx={0} questions={data.data} responses={responses} />]);
      } catch (e) {
        console.log(e.message);
      }
      finally {
        setLoader(false);
      }
    }
    if (loader) {
      fetchData();
    }
  }, [questions]);

  return (
    <>
      {loader ? "" :
        <div className='mainUI'>
          <div className='text-center text-lg p-4'>
            Interview
          </div>
          <div className='grid grid-cols-12 !h-full'>
            <Box
              sx={{
                width: 500,
                height: 500,
                borderRadius: 5,
              }}
              className="rounded-lg p-5 col-span-5 bg-gray-300 ml-3 !w-full !h-full"
            >
              <video controls={false} ref={videoRef} onEnded={() => setVideoEnded(true)} className='h-full w-full'>
                {console.log(videoUrl)}
                  <source id='hr-vdo' src={videoUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
              <div className='flex justify-center'>
                <Button onClick={playVideo} variant="contained">Play</Button>
              </div>
            </Box>
            <Box
              sx={{
                width: 500,
                height: 500,
                borderRadius: 5,
              }}
              className="rounded-lg p-5 col-span-7 !w-full !h-full"
            >
              <div className='h-full w-full p-5 bg-gray-400 rounded-lg'>
                {components.map((cmp, i) => {
                  return (
                    <div key={i}>
                      {cmp}
                    </div>
                  )
                })}
                <button onClick={addComponent} type='button' disabled={count == questions.length - 1 ? true : false}>Save</button>
                <div>
                  <div className='bg-yellow'>{value}</div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (isListening) {
                        setIsListening(false);
                        stop();
                      }
                      else {
                        setIsListening(true);
                        listen();
                      }
                    }}
                  // onMouseUp={stop}
                  >
                    🎤
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  let temp = responses;
                  temp.push(value);
                  setResponses([...responses, value]);
                  console.log(temp);
                  const data = axios.post('http://localhost:5000/iv/uploadResponses', {email: 'x@gmail.com', answers: temp});

                }}
              >
                Submit
              </button>
            </Box>
          </div>
        </div>
      }
    </>
  )
};

export default Interview;
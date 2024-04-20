import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import './Interview.css';
import video from '../../assets/istockphoto-1578508100-640_adpp_is.mp4';
import { useSpeechRecognition } from 'react-speech-kit';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
const Compo = () => {
  return (<>hi</>)
}

const NewQuestion = ({ idx, questions, responses }) => {
  return (
    <>
      <div className='font-bold mb-3'>
        {`Question-${idx + 1}: ${questions[idx].question}`}
      </div>
    </>
  );
};

const NewResponse = ({ responses, idx }) => {
  return (
    <>
      <div className=' mb-3'>
        {`Answer-${idx + 1}: ${responses[idx].answer}`}
      </div>
    </>
  );
};

function Interview() {
  const [value, setValue] = React.useState('');
  const [disableAll, setDisableAll] = React.useState(true);
  const [disablePlay, setDisablePlay] = React.useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [count, setCount] = useState(0);
  const videoRef = React.useRef(null);
  const data = JSON.parse(localStorage.getItem('dataList') || "[]");

  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    }
  });

  const playVideo = () => {
    videoRef.current.play();
    setDisablePlay(true);
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

  const nothing = () => {
    if (responses.length < components.length) {
      setResponses([...responses, { question: questions[questions.length - 1].question, answer: value }]);
      setValue('');
      setIsListening(false);
      stop();
    }
  };

  const addComponent = () => {
    setDisablePlay(false);
    setDisableAll(true);
    setIsListening(false);
    stop();
    videoRef.current.pause();
    var source = document.getElementById('hr-vdo');
    videoRef.current.load();
    source.setAttribute('src', questions[count + 1].videoUrl);
    setVideoUrl(questions[count + 1].videoUrl);
    setCount((prev) => prev + 1);
    setResponses([...responses, { question: questions[count].question, answer: value }]);
    setValue('');
    setComponents([...components,
    <NewQuestion key={components.length} idx={components.length} questions={questions} responses={responses} />
    ]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('https://hackathon-15hf.onrender.com/iv/getQuestions');
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
  const navigateTo = useNavigate();
  console.log('dbg', data);
  return (
    <>
      {loader || data?.length !== 0 ?
        <div className='w-full text-center h-[100vh] flex items-center flex-col justify-center font-bold'>
          <div>{`You might have done with the interview already!!!`}</div>
        </div> :
        <div className='mainUI'>
          <div className='text-center text-lg p-1'>
            Interview
          </div>
          <div className='grid grid-cols-12 !h-full'>
            <Box
              sx={{
                width: 500,
                height: 500,
                borderRadius: 5,
              }}
              className="rounded-lg px-2 col-span-5 ml-3 !w-full !h-full"
            >
              <video controls={false} ref={videoRef} onEnded={() => {
                setVideoEnded(true);
                setDisableAll(false);
              }}
                className='h-full w-full'>
                <source id='hr-vdo' src={videoUrl} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
              <div className='flex justify-center'>
                <Button className='absolute bottom-16' onClick={playVideo} variant="contained" disabled={disablePlay}>Play</Button>
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
              <div className='h-full w-full p-5 bg-gray-200 rounded-lg  overflow-y-scroll'>
                {components.map((cmp, i) => {
                  return (
                    <div key={i}>
                      {cmp}
                      {
                        (responses.length > i) ? <NewResponse responses={responses} idx={i} /> : <></>
                      }

                    </div>

                  )
                })}
                <div>{value}</div>
              </div>
              <div className='flex justify-center'>
                {
                  (responses?.length === questions?.length) ?
                    <Button
                      variant="contained"
                      className='absolute bottom-12'
                      onClick={() => {
                        console.log(responses);
                        const uni = uuidv4();
                        const data = axios.post('https://hackathon-15hf.onrender.com/iv/uploadResponses', { interviewId: uni, email: 'x@gmail.com', answers: responses });
                        localStorage.setItem('interviewId', uni);
                        localStorage.setItem('dataList', JSON.stringify(responses));
                        navigateTo('/feedback');
                      }}
                    >
                      Submit
                    </Button>
                    :
                    <div>
                      <div>
                        <button
                          disabled={disableAll}
                          className='text-lg absolute bottom-32'
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
                        >
                          <MicIcon fontSize='large' sx={{ color: `${isListening ? 'red' : 'black'}` }} />
                        </button>
                        {/* <Compo /> */}
                      </div>
                      <Button className='absolute bottom-12' variant="contained" onClick={(count === questions.length - 1) ? nothing : addComponent} type='button' disabled={((responses.length === questions.length) || (disableAll)) ? true : false}>Save</Button>
                    </div>
                }
              </div>
            </Box>
          </div>
        </div>
      }
    </>
  )
};

export default Interview;
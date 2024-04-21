import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import './Interview.css';
import video from '../../assets/istockphoto-1578508100-640_adpp_is.mp4';
import { useSpeechRecognition } from 'react-speech-kit';
import MicIcon from '@mui/icons-material/Mic';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import LoadingButton from '@mui/lab/LoadingButton';
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
  const { id } = useParams();
  const [value, setValue] = React.useState('');
  const [disableAll, setDisableAll] = React.useState(true);
  const [disablePlay, setDisablePlay] = React.useState(false);
  const [isListening, setIsListening] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [count, setCount] = useState(0);
  const videoRef = React.useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const data = JSON.parse(localStorage.getItem('dataList') || "[]");
  // const {isListening,transcript, startListening, stopListening} = useVoiceCollector();
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue((prev) => { return result });
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


  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const handleEnded = () => {
    // isListening(true);
    setVideoEnded(true);
    setDisableAll(false);
    // setIsListening(true);
    // start();
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
    setDisableAll(true);
    // setIsListening(false);
    stop();
    videoRef.current.pause();
    var source = document.getElementById('hr-vdo');
    videoRef.current.load();
    videoRef.current.play();
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
        const res = await axios.post('http://localhost:8000/iv/getIV', { interviewId: id });
        const iv = res.data.data[0];
        let temp = [];
        if (iv.skills.toLowerCase().includes('c++')) {
          temp.push('c++');
        }
        if (iv.skills.toLowerCase().includes('python')) {
          temp.push('python');
        }
        if (iv.skills.toLowerCase().includes('javascript')) {
          temp.push('js');
        }
        // console.log(temp, data.data[0].type);
        let temp2 = [];
        let finals = [];
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i]?.type === "basic" && finals.length === 0) {
            finals.push(data.data[i])
          }
          else {
            if (temp.includes(data.data[i]?.type)) {
              temp2.push(data.data[i])
            }
          }
          // console.log(data.data[i].type, i);
        }
        // console.log('temp2', temp2);
        let indices = [];
        for (let i = 0; i < iv.count; i++) {
          let idx = Math.floor(Math.random() * temp2.length);
          while (indices.includes(idx)) {
            idx = Math.floor(Math.random() * temp2.length);
          }
          indices.push(idx);
          finals.push(temp2[idx]);
        }
        // if (!questions) {
        // console.log(finals);
        setQuestions(finals);
        // }
        // else {
        //   console.log(questions);
        // }
        setVideoUrl(finals[0].videoUrl);
        setComponents([<NewQuestion key={0} idx={0} questions={finals} responses={responses} />]);
        setLoading(false);
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
  return (
    <>
      {loading ? "" : <>
        {loader || data?.length !== 0 ?
          <div className='w-full text-center h-[100vh] flex items-center flex-col justify-center font-bold'>
            <div>{`You might have done with the interview already!!!`}</div>
          </div> :
          <div className='mainUI'>
            <div className='text-center text-lg p-1 font-bold'>
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
                <video controls={false} ref={videoRef} onEnded={handleEnded}
                  className='h-full w-full'>
                  <source id='hr-vdo' src={videoUrl} type="video/mp4" />
                  Your browser does not support HTML video.
                </video>
                <div className='flex justify-center'>
                  {disablePlay ? "" :
                    <Button className='absolute bottom-16' onClick={playVideo} variant="contained" disabled={disablePlay}>Start Interview</Button>
                  }
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
                <div className='h-[600px] w-full p-5 bg-gray-200 rounded-lg  overflow-y-scroll'>
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
                      <>
                        {isSubmitting ?
                          <LoadingButton variant="contained" type='button' loading>
                            Submit
                          </LoadingButton> :
                          <Button
                            variant="contained"
                            onClick={async () => {
                              console.log(responses);
                              setSubmitting(true);
                              const res = await axios.post('http://localhost:8000/iv/uploadResponses', { interviewId: id, answers: responses });
                              const data = await axios.post('http://localhost:8000/ai/checkAnswers', {responses});
                              localStorage.setItem('interviewId', id);
                              localStorage.setItem('dataList', JSON.stringify(responses));
                              localStorage.setItem('scores', JSON.stringify(data.data.data));
                              navigateTo('/feedback');
                              setSubmitting(false);
                            }}
                          >
                            Submit
                          </Button>
                        }
                      </>

                      :
                      <div className='flex flex-row'>
                        <div>
                          <button
                            disabled={disableAll}
                            className='text-lg'
                            onClick={(e) => {
                              e.preventDefault();
                              // startStopListening();
                              if (isListening) {
                                setIsListening(false);
                                stop();
                                // addComponent();
                                if (count === questions.length - 1) {
                                  nothing();
                                }
                                else {
                                  addComponent();
                                }
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
                        {/* <Button className='' variant="contained" onClick={(count === questions.length - 1) ? nothing : addComponent} type='button' disabled={((responses.length === questions.length) || (disableAll)) ? true : false}>Save</Button> */}
                      </div>
                  }
                </div>
              </Box>
            </div>
          </div>
        }
      </>}

    </>
  )
};

export default Interview;
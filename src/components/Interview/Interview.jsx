import React from 'react';
import { Box, Button } from '@mui/material';
import './Interview.css';
import video from '../../assets/istockphoto-1578508100-640_adpp_is.mp4';
import { useSpeechRecognition } from 'react-speech-kit';

function Interview() {
  const [value, setValue] = React.useState('');
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

  return (
    <>
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
            <video controls={false} ref={videoRef} className='h-full w-full'>
              <source src={video} type="video/mp4" />
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
              <div>
                <textarea
                  value={value}
                  onChange={(event) => {
                    setValue(event.target.value)
                  }}
                />
                <button onClick={listen} onMouseUp={stop}>
                  🎤
                </button>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  )
};

export default Interview;
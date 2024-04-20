import React from 'react';
import { Box } from '@mui/material';
import './Interview.css';
import video from '../../assets/istockphoto-1578508100-640_adpp_is.mp4';
import { useSpeechRecognition } from 'react-speech-kit';

function Interview() {
  const [value, setValue] = React.useState('')
  const { listen, stop } = useSpeechRecognition({
    onResult: (result) => {
      console.log(result);
      setValue(result)
    }
  });

  return (
    <>
      <div className='mainUI grid grid-cols-2'>
        <Box
          sx={{
            width: 500,
            height: 500,
            borderRadius: 5,
          }}
          className="rounded-lg p-5 !w-full !h-full"
        >
          <video controls className='h-full w-full'>
            <source src={video} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        </Box>
        <Box
          sx={{
            width: 500,
            height: 500,
            borderRadius: 5,
          }}
          className="rounded-lg p-5 !w-full !h-full"
        >
          <div className='h-full w-full p-5 bg-gray-400 rounded-lg'>
            <div>
              <textarea
                value={value}
                onChange={(event) =>{
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
    </>
  )
};

export default Interview;
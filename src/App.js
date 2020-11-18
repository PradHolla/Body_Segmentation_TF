import React, {useRef} from 'react';
import * as tf from '@tensorflow/tfjs';
import * as bodypix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';
import logo from './logo.svg';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runBodysegment = async () =>{
    const net = await bodypix.load({
      architecture: 'ResNet50',
      outputStride: 32,
      quantBytes: 2
    });
    console.log('Bodypix loaded');
    setInterval(()=>{
      detect(net)
    },100);
  }

  const detect = async (net) => {
      //Video Properties
    if(typeof webcamRef.current !=='undefined' && webcamRef.current !== null && webcamRef.current.video.readyState===4){
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      //Video Dimensions (Sometimes you'll need to force the width)
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      //Making Detections
      const person = await net.segmentPersonParts(video,  {
        flipHorizontal: false,
        internalResolution: 'medium',
        segmentationThreshold: 0.7,
      });
      console.log(person);

      //Draw Detections
      const coloredPartImage = bodypix.toColoredPartMask(person);

      bodypix.drawMask(
        canvasRef.current,
        video,
        coloredPartImage,
        0.7,
        0,
        false
      );
      //drawCanvas(person, video, videoWidth, videoHeight, canvasRef);
    }
  };

  runBodysegment();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam ref={webcamRef}
        style = {{
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:'center',
          zIndex:9,
          width:640,
          height:480
        }} />
        <canvas ref={canvasRef}
        style = {{
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:'center',
          zIndex:9,
          width:640,
          height:480
        }} />
      </header>
    </div>
  );
}

export default App;

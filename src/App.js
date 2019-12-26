import React, {useState, useEffect} from 'react';
import './App.css';
import * as faceapi from 'face-api.js';
const MODEL_URL = './models';

function App() {
  const [img, setImg] = useState(null);
  const [faceCnt, setCount] = useState(0);

  useEffect(() => {
    const loadModal = async () => {
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      await faceapi.loadFaceLandmarkModel(MODEL_URL);
      await faceapi.loadFaceRecognitionModel(MODEL_URL);
    };
    loadModal();
  }, []);

  const handleUpload = async e => {
    const imgFile = e.target.files[0];
    const inputImg = await faceapi.bufferToImage(imgFile);

    setImg(inputImg.src);
  };

  // the detect face method
  const detectFace = async () => {
    const inputElement = document.getElementById('input-img');
    let fullFaceDescriptions = await faceapi
      .detectAllFaces(inputElement)
      .withFaceLandmarks()
      .withFaceDescriptors();
    setCount(fullFaceDescriptions.length);

    const canvas = document.getElementById('result-img');

    faceapi.matchDimensions(canvas, {
      width: inputElement.width,
      height: inputElement.height,
    });
    const resizedResults = faceapi.resizeResults(fullFaceDescriptions, {
      width: inputElement.width,
      height: inputElement.height,
    });
    faceapi.draw.drawDetections(canvas, resizedResults);
    faceapi.draw.drawFaceLandmarks(canvas, resizedResults);
  };

  return (
    <div className="App">
      {img && <img className="origin" src={img} id="input-img" />}
      <input id="myFileUpload" type="file" onChange={handleUpload} />
      <div>
        <button onClick={detectFace}>detect</button>
        <div>
          <p>{faceCnt} faces detected</p>
          <React.Fragment>
            <img src={img} className="defaultImg" />
            <canvas
              className="resultImg"
              id="result-img"
              width="200"
              height="auto"
            />
          </React.Fragment>
        </div>
      </div>
    </div>
  );
}

export default App;

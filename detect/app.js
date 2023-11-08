import * as tf from '@tensorflow/tfjs';
import {loadGraphModel} from '@tensorflow/tfjs-converter';

const video = document.getElementById('webcam');
const enableWebcamButton = document.getElementById('webcamButton');
async function loadModel() {
 const model = await loadGraphModel('https://path-to-your-model.json');
 return model;
}
async function detectObjects(video, model) {
 const tfImg = tf.browser.fromPixels(video).resizeNearestNeighbor([640, 480]);
 const obj = await model.executeAsync(tfImg);
 return obj;
}
function displayDetections(detections, video) {
 const ctx = document.getElementById('canvas').getContext('2d');
 ctx.drawImage(video, 0, 0, 640, 480);

 detections.forEach(detection => {
 const [x, y, width, height] = detection['bbox'];
 ctx.strokeStyle = '#00FF00';
 ctx.lineWidth = 4;
 ctx.strokeRect(x, y, width, height);

 const text = `${detection['class']} - ${Math.round(detection['score'] * 100)}%`;
 ctx.fillStyle = '#00FF00';
 ctx.fillText(text, x, y - 10);
 });
}
enableWebcamButton.addEventListener('click', function() {
 const constraints = {
 video: true
 };

 navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
 video.srcObject = stream;
 });
});
async function runDetection() {
 const model = await loadModel();
 setInterval(() => {
 const detections = detectObjects(video, model);
 displayDetections(detections, video);
 }, 1000);
}

runDetection();

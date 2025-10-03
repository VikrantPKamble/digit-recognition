let model;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let isDrawing = false;

// Load pretrained MNIST model from TensorFlow.js
async function loadModel() {
  document.getElementById("result").innerText = "Loading model...";
  model = await tf.loadLayersModel("https://storage.googleapis.com/tfjs-models/tfjs/mnist/model.json");
  document.getElementById("result").innerText = "Model loaded ✅ Draw a digit!";
}
loadModel();

// Drawing on canvas
canvas.addEventListener("mousedown", () => (isDrawing = true));
canvas.addEventListener("mouseup", () => (isDrawing = false, ctx.beginPath()));
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!isDrawing) return;
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

// Clear canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("result").innerText = "Prediction: ";
}

// Predict digit
async function predict() {
  let img = tf.browser.fromPixels(canvas, 1) // grayscale
              .resizeNearestNeighbor([28, 28]) // resize to 28x28
              .toFloat()
              .div(255.0) // normalize
              .expandDims(0); // add batch dimension

  let prediction = model.predict(img);
  let result = prediction.argMax(1).dataSync()[0];

  document.getElementById("result").innerText = "Prediction: " + result;
}

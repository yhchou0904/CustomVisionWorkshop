var express = require('express');
var app = express();
var fs = require("fs");
 
var bodyParser = require('body-parser');
var multer  = require('multer');

const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");
 
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}).array('image'));
 
app.get('/index.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "index.htm" );
})
 
app.post('/file_upload', function (req, res) {
  console.log(req.files[0]);  // 上传的文件信息
  var des_file = __dirname + "/" + req.files[0].originalname;
  fs.readFile( req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
        if( err ){
          console.log( err );
        }else{
        res.writeHead(200, {"Content-Type": "text/html"});
        var sizeOf = require('image-size');
        var dimensions = sizeOf(data);
        const { createCanvas, loadImage } = require('canvas');
        const canvas = createCanvas(dimensions.width, dimensions.height+50);
        const ctx = canvas.getContext('2d');
        loadImage(data).then((image) => {
        ctx.drawImage(image, 0, 0,dimensions.width, dimensions.height);
        });

        var tagStyle = {
          'car': "rgba(161, 230, 34, 1)",
          'motorcycle': "rgba(161, 230, 34, 1)"
          // etc.
        };

        (async () => {
          const predictor = new PredictionApi.PredictionAPIClient('cfc4cf193dd149cd8956ac7703398481', 'https://sample-classification.cognitiveservices.azure.com/customvision/v3.0/Prediction/b8ce75d2-925e-4e20-be8d-3f60454dd7bb/detect/iterations/Iteration1/image');
          const results = await predictor.detectImage('b8ce75d2-925e-4e20-be8d-3f60454dd7bb', 'Iteration1',data)
        // Show results

          res.write('<header>'+'<h1>Object Detection Result</h1>')
          if(Object.keys(results.predictions).length == 0){
            res.write("<p>There's no object be detected.</p></br>")
          }
        results.predictions.forEach(predictedResult => {
          console.log(`${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}`)
          res.write(`<p>${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}% ${predictedResult.boundingBox.left},${predictedResult.boundingBox.top},${predictedResult.boundingBox.width},${predictedResult.boundingBox.height}<br/>`);
          if (predictedResult.probability>0.5){
            ctx.strokeStyle = tagStyle[predictedResult.tagName];
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.rect(predictedResult.boundingBox.left * dimensions.width, predictedResult.boundingBox.top*dimensions.height, predictedResult.boundingBox.width*dimensions.width, predictedResult.boundingBox.height*dimensions.height);
            ctx.stroke();
          }
        });
        res.write('<img src="' + canvas.toDataURL() + '" />')
        res.end()
        })()
      }
    });
  });
})
 
var server = app.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("Please check http://localhost:%s/index.htm", port)
 
})
var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');

const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");

app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/' }).array('image'));

app.get('/index.htm', function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm");
})

app.post('/file_upload', function (req, res) {
  console.log(req.files[0]);
  var des_file = __dirname + "/test.png";
  fs.readFile(req.files[0].path, function (err, data) {
    fs.writeFile(des_file, data, function (err) {
      if (err) {
        console.log(err);
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        // Setting Canvas
        var sizeOf = require('image-size');
        var dimensions = sizeOf(data);
        const { createCanvas, loadImage } = require('canvas');
        const canvas = createCanvas(dimensions.width, dimensions.height + 50);
        const ctx = canvas.getContext('2d');
        //
        // Draw Image
        loadImage(data).then((image) => {
          ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);
        });
        //
        var tagStyle = {
          //setting style of bounding boxes

          //
        };

        (async () => {
          // Call api endpoint

          //
          res.write('<header>' + '<h1>Object Detection Result</h1>');

          // Deal with exception
          if (Object.keys(results.predictions).length == 0) {
            res.write('<p>There is no object be detected.</p></br>');
          }
          //

          // Draw Bounding Boxes
          results.predictions.forEach(predictedResult => {
            // construct result string

            //
            console.log(result);
            res.write(`<p>${result}<br/>`);
            if (predictedResult.probability > 0.5) {
              // set style of the box

              //
              ctx.beginPath();
              ctx.lineWidth = 10;
              ctx.rect( // draw rectangle bounding box

                //
              );
              ctx.stroke();
            }
          });
          // Show results

          //
          res.end();
        })()
      }
    });
  });
})

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("Please check localhost:8081/index.htm");

})
const util = require('util');
const fs = require('fs');
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");
const predictionKey = "<>";
const sampleDataRoot = "<>";
const endPoint = "<>";
const publishIterationName = "<>";
const projectId = "<>"


var testImage = process.argv.slice(2);

(async () => {
    const predictor = new PredictionApiClient.PredictionAPIClient(predictionKey, endPoint);
    const testFile = fs.readFileSync(testImage[0]);
    const results = await predictor.classifyImage(projectId, publishIterationName, testFile);
    
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()

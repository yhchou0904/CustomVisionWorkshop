const fs = require('fs');
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");

const projectId = "<ProjectID>";
const predictionKey = "<prediction key>";
const endPoint = "<prediction resource endpoint>";
const publishIterationName = "<name of published iteration>";

// use command-line argument as test file

//

(async () => {
    const predictor = new PredictionApiClient.PredictionAPIClient(predictionKey, endPoint);
    const testFile = fs.readFileSync(testImage[0]);
    const results = await predictor.classifyImage(projectId, publishIterationName, testFile);
    
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()
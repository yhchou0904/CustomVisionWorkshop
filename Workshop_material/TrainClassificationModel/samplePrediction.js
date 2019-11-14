const util = require('util');
const fs = require('fs');
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");
const predictionKey = "cfc4cf193dd149cd8956ac7703398481";
const sampleDataRoot = "/Users/yuhsuan/YuHsuan/Microsoft/customvision/Workshop_material/TrainClassificationModel/images";
const endPoint = "https://sampleclassificati-prediction.cognitiveservices.azure.com/";
const publishIterationName = "classifyModel";
const projectId = "cf249461-e0d9-44e6-81c4-a5cfefa836bb"


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
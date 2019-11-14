const util = require('util');
const fs = require('fs');
const TrainingAPIClient = require("@azure/cognitiveservices-customvision-training");
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");

const setTimeoutPromise = util.promisify(setTimeout);

const trainingKey = "<>";
const predictionKey = "<>";
const predictionResourceId = "<>";
const sampleDataRoot = "/images";

const trainEndPoint = "<>"
const predictEndPoint = "<>"

const publishIterationName = "<>";

const trainer = new TrainingAPIClient.TrainingAPIClient(trainingKey, trainEndPoint);

(async () => {
    console.log("Creating project...");
    const sampleProject = await trainer.createProject("<>")
    const dogTag = await trainer.createTag(sampleProject.id, "Dog");
    const catTag = await trainer.createTag(sampleProject.id, "Cat");
    console.log("Adding images...");
    let fileUploadPromises = [];

    const dogDir = `${sampleDataRoot}/dog`;
    const dogFiles = fs.readdirSync(dogDir);
    console.log(dogFiles);
    for (var idx in dogFiles) {
        await trainer.createImagesFromData(sampleProject.id, fs.readFileSync(`${dogDir}/${dogFiles[idx]}`), { tagIds: [dogTag.id] });
        console.log(`${dogFiles[idx]}`)
    }

    const catDir = `${sampleDataRoot}/cat`;
    const catFiles = fs.readdirSync(catDir);
    for (var idx in catFiles) {
        await trainer.createImagesFromData(sampleProject.id, fs.readFileSync(`${catDir}/${catFiles[idx]}`), { tagIds: [catTag.id] });
        console.log(`${catFiles[idx]}`)
    }

    console.log("Training...");
    let trainingIteration = await trainer.trainProject(sampleProject.id);

    // Wait for training to complete
    console.log("Training started...");
    while (trainingIteration.status == "Training") {
        console.log("Training status: " + trainingIteration.status);
        await setTimeoutPromise(1000, null);
        trainingIteration = await trainer.getIteration(sampleProject.id, trainingIteration.id)
    }
    console.log("Training status: " + trainingIteration.status);

    // Publish the iteration to the end point
    await trainer.publishIteration(sampleProject.id, trainingIteration.id, publishIterationName, predictionResourceId);

    console.log(`Project ID is: ${sampleProject.id}\n` +
        `Published Iteration Name is: ${publishIterationName}\n` +
        `Use these information to do prediction.`)

    const predictor = new PredictionApiClient.PredictionAPIClient(predictionKey, predictEndPoint);
    const testFile = fs.readFileSync(`${sampleDataRoot}/Test/test_image.jpg`);
    const results = await predictor.classifyImage(sampleProject.id, publishIterationName, testFile);

    // Step 6. Show results
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()

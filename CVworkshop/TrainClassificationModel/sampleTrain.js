const util = require('util');
const fs = require('fs');

const TrainingAPIClient = require("@azure/cognitiveservices-customvision-training");
const PredictionApiClient = require("@azure/cognitiveservices-customvision-prediction");

const setTimeoutPromise = util.promisify(setTimeout);

const trainingKey = "<training key>";
const predictionKey = "<prediction key>";
const predictionResourceId = "<resource id of prediction resource>";
const trainEndPoint = "<training resource endpoint>";
const predictEndPoint = "<prediction resource endpoint>";

const sampleDataRoot = "<use pwd to get path>";
const publishIterationName = "<name of published iteration>";

// create new api client

//

(async () => {
    console.log("Creating project...");
    // create new project
    const sampleProject = await trainer.createProject("<project name>");

    //

    console.log("Adding images...");

    // upload images
    const dogDir = `${sampleDataRoot}/dog`;
    const dogFiles = fs.readdirSync(dogDir);
    console.log(dogFiles);
    for (var idx in dogFiles) {
        // upload images of dogs

        //
        console.log(`${dogFiles[idx]}`);
    }

    const catDir = `${sampleDataRoot}/cat`;
    const catFiles = fs.readdirSync(catDir);
    for (var idx in catFiles) {
        // upload images of cats

        //
        console.log(`${catFiles[idx]}`);
    }
    //


    console.log("Training...");
    // start to train model

    //

    // Wait for training to complete
    console.log("Training started...");
    while (trainingIteration.status == "Training") {
        console.log("Training status: " + trainingIteration.status);
        await setTimeoutPromise(1000, null);
        // get training status

        //
    }
    console.log("Training status: " + trainingIteration.status);

    // Publish the iteration to the end point

    //

    console.log(`Project ID is: ${sampleProject.id}\n` +
        `Published Iteration Name is: ${publishIterationName}\n` +
        `Use these information to do prediction.`);

    const testFile = fs.readFileSync(`${sampleDataRoot}/Test/test_image.jpg`);
    // create prediction api client and predict

    //

    // Step 6. Show results
    console.log("Results:");
    results.predictions.forEach(predictedResult => {
        console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
    });
})()
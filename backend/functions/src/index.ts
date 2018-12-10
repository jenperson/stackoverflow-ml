import * as functions from 'firebase-functions';
import * as automl from '@google-cloud/automl';
const predictionClient = new automl.PredictionServiceClient();
const express = require('express');
const app = express();
const project = "automl-and-firebase"
const region = "us-central1";
const automl_model = "TCN6006523832861593722";


app.post("/", async (req, res) => {
  const text = decodeURI(req.body.text);
  console.log(text);
  const result = await checkML(text);
  res.send(result);
})

export const stackoverflow = {
  manual: functions.https.onRequest(app),
  automatic: {
      ask_question: functions.firestore.document("questions/{questionId}").onCreate(async (snap, context) => {
            const { text } = snap.data();
            const result = await checkML(text);
            return result;
      })
  }
};


async function checkML(text: String) {
  return new Promise((resolve, reject) => {
    const snippet = text;
    // Set the payload by giving the content and type of the file.
    const payload = {
      textSnippet: {
        content: snippet,
        mimeType: `text/plain`,
      },
    };
      const reqBody = {
          name: predictionClient.modelPath(project, region, automl_model),
          payload: payload
      }
      predictionClient.predict(reqBody)
          .then(responses => {
              console.log('Got a prediction from AutoML API!', JSON.stringify(responses));
              resolve(responses);
          })
          .catch(err => {
              console.log('AutoML API Error: ',err);
              reject(err);
          });
  });
}

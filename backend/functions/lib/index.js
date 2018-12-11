"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const automl = require("@google-cloud/automl");
const predictionClient = new automl.PredictionServiceClient();
const express = require('express');
const app = express();
const project = 'automl-and-firebase';
const region = 'us-central1';
const automl_model = 'TCN6006523832861593722';
app.post('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const text = decodeURI(req.body.text);
    console.log(text);
    try {
        const result = yield checkML(text);
        res.send(result);
    }
    catch (err) {
        console.warn('AutoML API Error: ', err);
        res.send({ err: 'API call failed' });
    }
}));
exports.stackoverflow = {
    manual: functions.https.onRequest(app),
    automatic: {
        ask_question: functions.firestore.document('questions/{questionId}').onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
            const { text } = snap.data();
            const result = yield checkML(text);
            return result;
        }))
    }
};
function checkML(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const snippet = text;
        // Set the payload by giving the content and type of the file.
        const payload = {
            textSnippet: {
                content: snippet,
                mimeType: 'text/plain',
            },
        };
        const reqBody = {
            name: predictionClient.modelPath(project, region, automl_model),
            payload: payload
        };
        const responses = yield predictionClient.predict(reqBody);
        console.log('Got a prediction from AutoML API!', JSON.stringify(responses));
        return responses;
    });
}
//# sourceMappingURL=index.js.map
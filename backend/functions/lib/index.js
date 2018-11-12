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
const automl = require('@google-cloud/automl');
const predictionClient = new automl.PredictionServiceClient();
const express = require('express');
const app = express();
//const client = new automl.v1beta1.PredictionServiceClient();
const project = "automl-and-firebase";
const region = "us-central1";
const automl_model = "TCN5948718394658568591";
app.post("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    console.log(req.body);
    const text = decodeURI(req.body.text);
    let date = req.body.date;
    if (!date) {
        date = new Date();
    }
    console.log(text);
    const result = yield scanQuestion(text, date);
    res.send(result);
}));
exports.stackoverflow = {
    manual: functions.https.onRequest(app),
    automatic: {
        ask_question: functions.firestore.document("questions/{questionId}").onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
            const { text } = snap.data();
            const date = new Date();
            const result = yield scanQuestion(text, date);
            return result;
        }))
    }
};
//app.use(stackoverflow.manual);
// Expose the API as a function
//exports.api = functions.https.onRequest(app);
function scanQuestion(text, date) {
    return __awaiter(this, void 0, void 0, function* () {
        const body = text.toLowerCase();
        let newString = "";
        const day = date.getDay() + "day " + date.getUTCHours() + "time";
        // check if there's code
        if (body.includes("<code>")) {
            const length = findCodeLength(body);
            newString += ` ${length}code`;
        }
        // log number of question marks
        newString += ` ?${(body.split("?").length - 1)}`;
        // an image link
        if (body.includes("<img>")) {
            const count = countOccurance(body, "<img>");
            newString += ` ${count}imglink`;
        }
        // get length of question
        newString += ` length${body.length}`;
        if (body.includes("please")) {
            const count = countOccurance(body, "please");
            newString += ` ${count}please`;
        }
        if (body.includes("help")) {
            const count = countOccurance(body, "help");
            newString += ` ${count}help`;
        }
        if (body.includes(". ")) {
            const count = countOccurance(body, ". ");
            newString += ` ${count}periods`;
        }
        if (body.includes("! ")) {
            const count = countOccurance(body, "! ");
            newString += ` ${count}!`;
        }
        if (body.includes("tried") || body.includes("try")) {
            const count = countOccurance(body, "tried")
                + countOccurance(body, "try");
            newString += ` ${count}tried`;
        }
        if (body.includes("copy") || body.includes("copied")) {
            const count = countOccurance(body, "copy")
                + countOccurance(body, "copied");
            newString += ` ${count}copy`;
        }
        if (body.includes("watch")) {
            const count = countOccurance(body, "watch");
            newString += ` ${count}watch`;
        }
        if (body.includes("exact")) {
            const count = countOccurance(body, "exact");
            newString += ` ${count}exact`;
        }
        if (body.includes("choose") || body.includes("chose")
            || body.includes("choice")) {
            const count = countOccurance(body, "choose")
                + countOccurance(body, "chose")
                + countOccurance(body, "choice");
            newString += ` ${count}choose`;
        }
        if (body.includes("work")) {
            const count = countOccurance(body, "work");
            newString += ` ${count}work`;
        }
        if (body.includes("advice") || body.includes("advise")) {
            const count = countOccurance(body, "advice")
                + countOccurance(body, "advise");
            newString += ` ${count}advice`;
        }
        if (body.includes("know")) {
            const count = countOccurance(body, "know");
            newString += ` ${count}know`;
        }
        if (body.includes("undefined")) {
            const count = countOccurance(body, "undefined");
            newString += ` ${count}undefined`;
        }
        if (body.includes(" time")) {
            const count = countOccurance(body, " time");
            newString += ` ${count}time`;
        }
        if (body.includes("way")) {
            const count = countOccurance(body, "way");
            newString += ` ${count}way`;
        }
        // catch instances of simple and simply
        if (body.includes("simpl") || body.includes("basic")) {
            const count = countOccurance(body, "simpl")
                + countOccurance(body, "basic");
            newString += ` ${count}simple`;
        }
        if (body.includes("easy") || body.includes("easier")) {
            const count = countOccurance(body, "easy")
                + countOccurance(body, "easier");
            newString += ` ${count}easy`;
        }
        if (body.includes("hard")) {
            const count = countOccurance(body, "hard");
            newString += ` ${count}hard`;
        }
        if (body.includes("hint")) {
            const count = countOccurance(body, "hint");
            newString += ` ${count}hint`;
        }
        if (body.includes("need")) {
            const count = countOccurance(body, "need");
            newString += ` ${count}need`;
        }
        if (body.includes("only")) {
            const count = countOccurance(body, "only");
            newString += ` ${count}only`;
        }
        if (body.includes("version")) {
            const count = countOccurance(body, "version");
            newString += ` ${count}version`;
        }
        if (body.includes("think")) {
            const count = countOccurance(body, "think");
            newString += ` ${count}think`;
        }
        if (body.includes("...")) {
            const count = countOccurance(body, "...");
            newString += ` ${count}...`;
        }
        if (body.includes("other")) {
            const count = countOccurance(body, "other");
            newString += ` ${count}other`;
        }
        if (body.includes("why")) {
            const count = countOccurance(body, "why");
            newString += ` ${count}why`;
        }
        if (body.includes("what")) {
            const count = countOccurance(body, "what");
            newString += ` ${count}what`;
        }
        if (body.includes("which")) {
            const count = countOccurance(body, "which");
            newString += ` ${count}which`;
        }
        if (body.includes("now")) {
            const count = countOccurance(body, "now");
            newString += ` ${count}now`;
        }
        if (body.includes("soon")) {
            const count = countOccurance(body, "soon");
            newString += ` ${count}soon`;
        }
        if (body.includes(" sure")) {
            const count = countOccurance(body, " sure");
            newString += ` ${count}sure`;
        }
        if (body.includes("unsure") || body.includes("not sure")) {
            const count = countOccurance(body, "unsure")
                + countOccurance(body, "not sure");
            newString += ` ${count}unsure`;
        }
        // catch assume and assuming
        if (body.includes("assum")) {
            const count = countOccurance(body, "assum");
            newString += ` ${count}assume`;
        }
        if (body.includes("who")) {
            const count = countOccurance(body, "who");
            newString += ` ${count}who`;
        }
        if (body.includes("how")) {
            const count = countOccurance(body, "how");
            newString += ` ${count}how`;
        }
        if (body.includes("can't") || body.includes("cant")
            || body.includes("can not") || body.includes("cannot")) {
            const count = countOccurance(body, "can't")
                + countOccurance(body, "cant")
                + countOccurance(body, "can not")
                + countOccurance(body, "cannot");
            newString += ` ${count}cant`;
        }
        if (body.includes("thank")) {
            const count = countOccurance(body, "thank");
            newString += ` ${count}thanks`;
        }
        if (body.includes("tutorial")) {
            const count = countOccurance(body, "tutorial");
            newString += ` ${count}tutorial`;
        }
        if (body.includes("problem")) {
            const count = countOccurance(body, "problem");
            newString += ` ${count}problem`;
        }
        if (body.includes("way")) {
            const count = countOccurance(body, "way");
            newString += ` ${count}way`;
        }
        if (body.includes("fix")) {
            const count = countOccurance(body, "fix");
            newString += ` ${count}fix`;
        }
        if (body.includes("issue")) {
            const count = countOccurance(body, "issue");
            newString += ` ${count}issue`;
        }
        if (body.includes("bug")) {
            const count = countOccurance(body, "bug");
            newString += ` ${count}bug`;
        }
        if (body.includes("error")) {
            const count = countOccurance(body, "error");
            newString += ` ${count}error`;
        }
        if (body.includes("crash")) {
            const count = countOccurance(body, "crash");
            newString += ` ${count}crash`;
        }
        if (body.includes("show")) {
            const count = countOccurance(body, "show");
            newString += ` ${count}show`;
        }
        if (body.includes("show me")) {
            const count = countOccurance(body, "show me");
            newString += ` ${count}showme`;
        }
        if (body.includes("close")) {
            const count = countOccurance(body, "close");
            newString += ` ${count}close`;
        }
        if (body.includes("doesn't") || body.includes("doesnt")
            || body.includes("does not")) {
            const count = countOccurance(body, "doesn't")
                + countOccurance(body, "doesnt")
                + countOccurance(body, "does not");
            newString += ` ${count}doesnt`;
        }
        if (body.includes("answer")) {
            const count = countOccurance(body, "answer");
            newString += ` ${count}answer`;
        }
        if (body.includes("new")) {
            const count = countOccurance(body, "new");
            newString += ` ${count}new`;
        }
        if (body.includes("example")) {
            const count = countOccurance(body, "example");
            newString += ` ${count}example`;
        }
        if (body.includes("reference")) {
            const count = countOccurance(body, "reference");
            newString += ` ${count}reference`;
        }
        if (body.includes(" code ")) {
            const count = countOccurance(body, " code ");
            newString += ` ${count}codeword`;
            ;
        }
        if (body.includes("more")) {
            const count = countOccurance(body, "more");
            newString += ` ${count}more`;
        }
        if (body.includes("most")) {
            const count = countOccurance(body, "most");
            newString += ` ${count}most`;
        }
        if (body.includes("slow")) {
            const count = countOccurance(body, "slow");
            newString += ` ${count}slow`;
        }
        if (body.includes("fast")) {
            const count = countOccurance(body, "fast");
            newString += ` ${count}fast`;
        }
        if (body.includes("hurry")) {
            const count = countOccurance(body, "hurry");
            newString += ` ${count}hurry`;
        }
        if (body.includes("quick")) {
            const count = countOccurance(body, "quick");
            newString += ` ${count}quick`;
        }
        if (body.includes("incorrect")) {
            const count = countOccurance(body, "incorrect");
            newString += ` ${count}incorrect`;
        }
        if (body.includes(" correct")) {
            const count = countOccurance(body, " correct");
            newString += ` ${count}correct`;
        }
        if (body.includes("update")) {
            const count = countOccurance(body, "update");
            newString += ` ${count}update`;
        }
        if (body.includes("already") || body.includes("allready")
            || body.includes("all ready")) {
            const count = countOccurance(body, "already")
                + countOccurance(body, "allready")
                + countOccurance(body, "all ready");
            newString += ` ${count}already`;
        }
        if (body.includes("sometime") || body.includes("some time")) {
            const count = countOccurance(body, "sometime")
                + countOccurance(body, "some time");
            newString += ` ${count}sometimes`;
        }
        if (body.includes("want")) {
            const count = countOccurance(body, "want");
            newString += ` ${count}want`;
        }
        if (body.includes("always") || body.includes("allways")
            || body.includes("all ways")) {
            const count = countOccurance(body, "always")
                + countOccurance(body, "allways")
                + countOccurance(body, "all ways");
            newString += ` ${count}always`;
        }
        if (body.includes("never")) {
            const count = countOccurance(body, "never");
            newString += ` ${count}never`;
        }
        if (body.includes("every")) {
            const count = countOccurance(body, "every");
            newString += ` ${count}every`;
        }
        if (body.includes("first")) {
            const count = countOccurance(body, "first");
            newString += ` ${count}first`;
        }
        if (body.includes("should ")) {
            const count = countOccurance(body, "should ");
            newString += ` ${count}should`;
        }
        if (body.includes("shouldn't") || body.includes("shouldnt")
            || body.includes("should not")) {
            const count = countOccurance(body, "shouldn't")
                + countOccurance(body, "shouldnt")
                + countOccurance(body, "should not");
            newString += ` ${count}shouldnt`;
        }
        if (body.includes("have ") || body.includes("had ")
            || body.includes("having")) {
            const count = countOccurance(body, "have ")
                + countOccurance(body, "had ")
                + countOccurance(body, "having");
            newString += ` ${count}have`;
        }
        if (body.includes("haven't") || body.includes("hadn't")
            || body.includes("havent") || body.includes("hadnt")
            || body.includes("have not") || body.includes("had not")) {
            const count = countOccurance(body, "haven't")
                + countOccurance(body, "hadn't")
                + countOccurance(body, "havent")
                + countOccurance(body, "hadnt");
            +countOccurance(body, "have not");
            +countOccurance(body, "had not");
            newString += ` ${count}havent`;
        }
        if (body.includes("could ")) {
            const count = countOccurance(body, "could ");
            newString += ` ${count}could`;
        }
        if (body.includes("step")) {
            const count = countOccurance(body, "step");
            newString += ` ${count}step`;
        }
        if (body.includes("video")) {
            const count = countOccurance(body, "video");
            newString += ` ${count}video`;
        }
        if (body.includes("wrong")) {
            const count = countOccurance(body, "wrong");
            newString += ` ${count}wrong`;
        }
        if (body.includes("couldn't") || body.includes("couldnt")
            || body.includes("could not")) {
            const count = countOccurance(body, "couldn't")
                + countOccurance(body, "couldnt")
                + countOccurance(body, "could not");
            newString += ` ${count}couldnt`;
        }
        if (body.includes("won't") || body.includes("wont")
            || body.includes("wouldn't") || body.includes("wouldnt")
            || body.includes("would not") || body.includes("will not")) {
            const count = countOccurance(body, "won't")
                + countOccurance(body, "wont")
                + countOccurance(body, "wouldn't")
                + countOccurance(body, "would not")
                + countOccurance(body, "will not");
            newString += ` ${count}wouldnt`;
        }
        if (body.includes("before") || body.includes("used to")
            || body.includes("use to")) {
            const count = countOccurance(body, "before") +
                countOccurance(body, "used to") +
                countOccurance(body, "use to");
            newString += ` ${count}before`;
        }
        const noHTML = removeHTML(body);
        newString = noHTML + " " + newString + " " + day;
        console.log(newString);
        return yield checkML(newString);
    });
}
function findCodeLength(body) {
    let index = 0;
    let length = 0;
    while (index !== -1) {
        const start = body.indexOf("<code>", index + 1);
        if (start === -1) {
            index = -1;
            return length;
        }
        const end = body.indexOf("</code>", start + 1);
        const addlength = end - start;
        length += addlength;
        index = end;
    }
    return length;
}
function countOccurance(body, value) {
    let index = 0;
    let count = 0;
    const wordLength = value.length;
    while (index !== -1) {
        index = body.indexOf(value, index);
        if (index === -1) {
            return count;
        }
        count += 1;
        index += wordLength;
    }
    return count;
}
function removeHTML(body) {
    return body.replace(/<[^>]*>?/g, '');
}
// here's where check to ML will go
function checkML(text) {
    return __awaiter(this, void 0, void 0, function* () {
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
            };
            predictionClient.predict(reqBody)
                .then(responses => {
                console.log('Got a prediction from AutoML API!', JSON.stringify(responses));
                resolve(responses);
            })
                .catch(err => {
                console.log('AutoML API Error: ', err);
                reject(err);
            });
        });
    });
}
//# sourceMappingURL=index.js.map
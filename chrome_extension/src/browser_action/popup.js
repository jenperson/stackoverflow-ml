const bkg = chrome.extension.getBackgroundPage();

let parseClassification = (response) => {
    let classifications = response[0].payload;
    let label_arr = [];
    let displayStr = ``;

    for (let i in classifications) {
        let data = classifications[i];
        bkg.console.log(data); // Logs to background.html
        let label = data.displayName;
        let score_pct = data.classification.score * 100;
        label_arr.push([label, score_pct]);
    }

    // Sort the list of labels by confidence
    label_arr.sort((a, b) => {
      return b[1] - a[1];
    });
    let top_5 = label_arr.slice(0,5);
    
    for (let i in top_5) {
      displayStr += `<strong>${top_5[i][0]}</strong>: ${Math.round(top_5[i][1] * 100) / 100}%<br/>`;
    }
    bkg.console.log(displayStr);
    return displayStr;
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      message.innerText = request.source;
    }
  });
  
  function onWindowLoad() {
  
    var message = document.querySelector('#message');
  
    chrome.tabs.executeScript(null, {
      file: "src/browser_action/getPagesSource.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  
  }
  
  window.onload = onWindowLoad;
$('#call-model').on('click', (e) => {
    //let text = $('#question').val();
    let text = message.innerText;
    text = encodeURI(text);
    message.innerText = "";
    bkg.console.log(`Sending question ${text} to model...`);
    let url = 'https://us-central1-automl-and-firebase.cloudfunctions.net/stackoverflow-manual/';
   // ?text=${text}`;
    let data = {
      text: text
    }
    $('#status').text('Sending to model...');
    $.post(url, data, (res) => {
        let displayText = parseClassification(res);
        $('#status').text('');
        $('#result').html(displayText);
    });
});
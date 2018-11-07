const bkg = chrome.extension.getBackgroundPage();

let parseClassification = (response) => {
    let classifications = response[0].payload;
    let displayStr = ``;

    for (let i in classifications) {
        let data = classifications[i];
        bkg.console.log(data); // Logs to background.html
        let label = data.displayName;
        let score_pct = data.classification.score * 100;
        displayStr += `${label}: ${score_pct.toFixed(1)}%\n`;
    }
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
    //let text = $('#message').val();
    let text = message.innerText;
    text = encodeURI(text);
    message.innerText = text;

    bkg.console.log(`Sending question ${text} to model...`);
    let url = `https://us-central1-automl-and-firebase.cloudfunctions.net/stackoverflow-manual?text=${text}`;
    $('#status').text('Sending to model...');
    $.post(url, (data) => {
        let displayText = parseClassification(data);
        $('#status').text('');
        $('#result').text(displayText);
    });
});
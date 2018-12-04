const bkg = chrome.extension.getBackgroundPage();
let label;

let addTabs = (response) => {
  let classifications = response[0].payload;
  console.log("addtabs")
  //console.log(classifications);
  for (let i in classifications) {
      let data = classifications[i];
      console.log(data);
      label = data.displayName;
      console.log(label);
      let score_pct = data.classification.score * 100;
      if (score_pct > 1) {
        var selector = {label: label};
        chrome.tabs.executeScript({
          code: '(' + function(params) {
            document.querySelector('.tag-editor.s-input').insertAdjacentHTML('afterbegin',
            '<span><span class="s-tag rendered-element">'+params.label+'<a class="js-delete-tag s-tag--dismiss" title="Remove tag"><svg style="pointer-events:none;" class="svg-icon iconClearSm" width="12" height="12" viewBox="0 0 14 14"><path d="M12 3.41L10.59 2 7 5.59 3.41 2 2 3.41 5.59 7 2 10.59 3.41 12 7 8.41 10.59 12 12 10.59 8.41 7z"></path></svg></a></span></span>'
            );
              return {success: true, html: document.body.innerHTML};
          } + ')(' + JSON.stringify(selector) + ');'
        });
      }
  }


}

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
      let confidence_pct = Math.round(top_5[i][1] * 100) / 100;
      displayStr += `<span class="tag"><strong>${top_5[i][0]}</strong>: ${confidence_pct}%<span><div id="${top_5[i][0]}" class="progress-outer"><div class="progress-inner"></div></div>`;
    }
    return [displayStr, top_5];
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action == "getSource") {
      message.innerText = request.source;
    }
  });
  
  function onWindowLoad() {
  
    var message = document.querySelector('#mainPopup');
  
    chrome.tabs.executeScript(null, {
      file: "src/browser_action/getPagesSource.js"
    }, function() {
      // If you try and inject into an extensions page or the webstore/NTP you'll get an error
      if (chrome.runtime.lastError) {
        message.innerHTML = '<p>Navigate to a <a href="https://stackoverflow.com">Stack Overflow</a> question to use this extension';
      }
    });
  
  }
  
  window.onload = onWindowLoad;
$('#call-model').on('click', (e) => {
    let text = message.innerText;
    text = encodeURI(text);
    message.innerText = "";
    bkg.console.log(`Sending question ${text} to model...`);
    let url = 'https://us-central1-automl-and-firebase.cloudfunctions.net/stackoverflow-manual/';
    let data = {
      text: text
    }
    $('#status').text('Sending to model...');
    let top_tags = [];
    $.post(url, data, (res) => {
        addTabs(res);
        let modelResp = parseClassification(res);
        let displayText = modelResp[0];
        top_tags = modelResp[1];
        $('#status').text('');
        bkg.console.log('hey1');
        $('#result').html(displayText);
    }).then(() => {
      for (let i in top_tags) {
        let tag_name = top_tags[i][0];
        let pct = top_tags[i][1];
        $('#' + tag_name + ' .progress-inner').css('width', pct + '%');
      }
    });
});
var bkg = chrome.extension.getBackgroundPage();

let parseClassification = (response) => {
    let classifications = response[0].payload;
    let displayStr = ``;

    for (let i in classifications) {
        let data = classifications[i];
        let label = data.displayName;
        let score_pct = data.classification.score * 100;
        displayStr += `${label}: ${score_pct.toFixed(1)}%\n`;
    }
    return displayStr;
}

$('#call-model').on('click', (e) => {
    let text = $('#question').val();
    let url = `https://us-central1-automl-and-firebase.cloudfunctions.net/stackoverflow-manual?text=${text}`;
    $('#status').text('Sending to model...');
    $.post(url, (data) => {
        let displayText = parseClassification(data);
        $('#status').text('');
        $('#result').text(displayText);
    });
});
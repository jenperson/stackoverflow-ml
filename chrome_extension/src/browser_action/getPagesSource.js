function DOMtoString(document_root) {
  var html = 'groo';
  // pull content of question
  // question in progress
  if(window.location.href.indexOf("questions/ask") > -1) {
    html  = document_root.querySelector(".wmd-preview").innerHTML;
    // published question
  } else if (window.location.href.indexOf("stackoverflow.com" > -1)) {
    html  = document_root.querySelector(".post-text").innerHTML;
  } else {
    html = "please go to stackoverflow web page to ask a question"
  }
  return html;
}

chrome.runtime.sendMessage({
  action: "getSource",
  source: DOMtoString(document)
});
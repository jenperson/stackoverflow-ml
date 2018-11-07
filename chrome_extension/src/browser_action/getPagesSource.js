function DOMtoString(document_root) {
  var html = '';
  // pull content of question
  // question in progress
  //var question = document_root.querySelector(".wmd-preview").innerHTML;
  // published question
  var question = document_root.querySelector(".post-text").innerHTML;
  html += question;
  return html;
}

chrome.runtime.sendMessage({
  action: "getSource",
  source: DOMtoString(document)
});
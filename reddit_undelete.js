// chrome.runtime.onMessage.addListener(function(request, sender) {
	// if (request.action == "getSource") {
	// 	message.innerText = request.source;
	// }
// });

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('Replacing [deleted] comments on activeTab with original contents.');

  // chrome.tabs.executeScript({
  //   code: 'document.body.style.backgroundColor="red"'
  // });

  chrome.tabs.executeScript(null, {
    file: "reddit_source.js"
  }, function(){
  	// if (chrome.runtime.lastError) {
  	// 	message.innerText = 'There was an error.'
  	// }
  });
});
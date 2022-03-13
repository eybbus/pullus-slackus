// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");

// TODO: implement user conversion
// const users = {
// 	github: 'name',
// 	slackMention: '@name'
// }

chrome.storage.sync.get("color", ({ color }) => {
  changeColor.style.backgroundColor = color;
});


// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: copyText,
  });
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}




function copyText() {

	function copyTextToClipboard(text) {
		//Create a textbox field where we can insert text to. 
		var copyFrom = document.createElement("textarea");
	
		//Set the text content to be the text you wished to copy.
		copyFrom.textContent = text;
	
		//Append the textbox field into the body as a child. 
		//"execCommand()" only works when there exists selected text, and the text is inside 
		//document.body (meaning the text is part of a valid rendered HTML element).
		document.body.appendChild(copyFrom);
	
		//Select all the text!
		copyFrom.select();
	
		//Execute command
		document.execCommand('copy');
	
		//(Optional) De-select the text using blur(). 
		copyFrom.blur();
	
		//Remove the textbox field from the document.body, so no other JavaScript nor 
		//other elements can get access to this.
		document.body.removeChild(copyFrom);
	}

	let fullTitle = document.getElementsByClassName('gh-header-title')[0]
	let pullName =  fullTitle.children[0].innerText
	let pullId = fullTitle.children[1].innerText

	let reviewersForm = document.getElementsByClassName('js-issue-sidebar-form')[0]
	

	let TitleString = `${pullName} [${pullId}](${window.location.href})`

	let requestString = 'Requested: '

	let assignees = reviewersForm.getElementsByClassName('assignee')

	if (assignees.length > 0) {
		[...assignees].forEach(el => {
			let userAccountName = el.innerText
			requestString = requestString + ` @${userAccountName}`
		})
	}
	
	copyTextToClipboard(`${TitleString} \n ${requestString}`)
}

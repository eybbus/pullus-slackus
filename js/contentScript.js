function constructButtons() {
	const reviewersForm = document.querySelector('.js-issue-sidebar-form');

	let btnContainer = document.createElement('div');
	btnContainer.id = 'copyBtnContainer';

	let quickCopyBtn = document.createElement('button');
	quickCopyBtn.innerText = 'Quick Copy';
	quickCopyBtn.type = 'button';
	quickCopyBtn.id = 'copyBtn';
	quickCopyBtn.classList.add('btn');
	quickCopyBtn.addEventListener('click', handleQuickCopy);



	let copyOptionsBtn = document.createElement('Button');
	copyOptionsBtn.innerText = 'TODO';
	copyOptionsBtn.type = 'button';
	copyOptionsBtn.id = 'copyOptionsBtn';
	copyOptionsBtn.classList.add('btn');
	// copyOptionsBtn.addEventListener('click', );


	reviewersForm.append(btnContainer);
	btnContainer.append(quickCopyBtn);
	btnContainer.append(copyOptionsBtn);
}



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
};

function handleQuickCopy() {
	let fullTitle = document.getElementsByClassName('gh-header-title')[0];
	let pullName =  fullTitle.children[0].innerText;
	let pullId = fullTitle.children[1].innerText;

	let TitleString = `${pullName} [${pullId}](${window.location.href})`;

	let requestString = 'Requested: ';

	const reviewersForm = document.querySelector('.js-issue-sidebar-form');
	let assignees = reviewersForm.getElementsByClassName('assignee');

	if (assignees.length > 0) {
		[...assignees].forEach(el => {
			let userAccountName = el.innerText;
			requestString = requestString + ` @${userAccountName}`;
		})
	}

	copyTextToClipboard(`${TitleString} \n ${requestString}`);
	
	let quickCopyBtn = document.querySelector('#copyBtn');
	quickCopyBtn.innerText = '✔️';
	setTimeout(() => {
		quickCopyBtn.innerText = 'Quick Copy';
	}, 1000);
	
};


function constructButtons() {
	const reviewersForm = document.querySelector('.js-issue-sidebar-form');

	let btnContainer = document.createElement('div');
	btnContainer.id = 'copyBtnContainer';

	let quickCopyBtn = document.createElement('button');
	quickCopyBtn.innerText = 'Quick Copy';
	quickCopyBtn.type = 'button';
	quickCopyBtn.id = 'copyBtn';
	quickCopyBtn.classList.add('btn');
	quickCopyBtn.addEventListener('click', handleQuickCopy);



	let copyOptionsBtn = document.createElement('Button');
	copyOptionsBtn.innerText = 'TODO';
	copyOptionsBtn.type = 'button';
	copyOptionsBtn.id = 'copyOptionsBtn';
	copyOptionsBtn.classList.add('btn');
	// copyOptionsBtn.addEventListener('click', );


	reviewersForm.append(btnContainer);
	btnContainer.append(quickCopyBtn);
	btnContainer.append(copyOptionsBtn);
}


constructButtons()
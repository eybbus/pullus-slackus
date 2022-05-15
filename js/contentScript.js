/**
 *
 * @param {string} name
 * @param {string} type
 * @param {string} id
 * @param {string[]} classList
 * @param {() => void} onclick
 * @returns HTMLButtonElement
 */
function createButton(name, type, id, classList, onclick) {
  let button = document.createElement("button");
  button.innerText = name;
  button.type = type;
  button.id = id;
  button.classList.add(classList);
  button.addEventListener("click", onclick);

  return button;
}

/**
 * Constructs the buttons and adds them to the dom.
 * @returns boolean, was it a success or a failure
 */
function constructButtons() {
  const reviewersForm = document.querySelector(".js-issue-sidebar-form");
  const buttonsAlreadyExists = !!document.querySelector("#copyBtnContainer");

  // The reviewForms does not exist.
  if (!reviewersForm || buttonsAlreadyExists) return false;

  let btnContainer = document.createElement("div");
  btnContainer.id = "copyBtnContainer";

  let quickCopyBtn = createButton(
    "Quick Copy",
    "button",
    "copyBtn",
    "btn",
    handleQuickCopy
  );

  let copyOptionsBtn = createButton(
    "Options [TODO]",
    "button",
    "copyOptionsBtn",
    "btn",
    () => {}
  );
  copyOptionsBtn.disabled = true;

  let customCopyBtn = createButton(
    "Custom Copy [TODO]",
    "button",
    "customCopyBtn",
    "btn",
    () => {}
  );

  reviewersForm.append(btnContainer);
  btnContainer.append(quickCopyBtn);
  btnContainer.append(copyOptionsBtn);
  btnContainer.append(customCopyBtn);

  return true;
}

//TODO: replace wusing navigation version. execCommand depricated.
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
  document.execCommand("copy");

  //(Optional) De-select the text using blur().
  copyFrom.blur();

  //Remove the textbox field from the document.body, so no other JavaScript nor
  //other elements can get access to this.
  document.body.removeChild(copyFrom);
}

function handleQuickCopy() {
  let projectField = "_*Project:*_         ";
  let nameField = "_*Name:*_           ";
  let requestField = "_*Requested:*_   ";

  let projectElement = document.querySelector(
    '[data-pjax="#repo-content-pjax-container"]'
  );

  projectField += `[${projectElement.outerText}](${projectElement.href})`;

  let nameElement = document.getElementsByClassName("gh-header-title")[0];
  let pullName = nameElement.children[0].innerText;
  let pullId = nameElement.children[1].innerText;

  nameField += `${pullName} [${pullId}](${window.location.href})`;

  const reviewersFormElement = document.querySelector(".js-issue-sidebar-form");
  let assignees = reviewersFormElement.getElementsByClassName("assignee");

  if (assignees.length > 0) {
    [...assignees].forEach((el) => {
      let userAccountName = el.innerText;
      requestField += ` @${userAccountName}`;
    });
  }

  copyTextToClipboard(`
  ${projectField}
  ${nameField}
  ${requestField}`);

  let quickCopyBtn = document.querySelector("#copyBtn");
  quickCopyBtn.innerText = "✔️";
  setTimeout(() => {
    quickCopyBtn.innerText = "Quick Copy";
  }, 1000);
}

/**
 * Waits for an element satisfying selector to exist, then resolves promise with the element.
 * Useful for resolving race conditions.
 * @author jwilson8767
 * @license MIT_Licensed
 * @param selector
 * @returns {Promise}
 */
function elementReady(selector) {
  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }
    new MutationObserver((mutationRecords, observer) => {
      // Query for elements matching the specified selector
      Array.from(document.querySelectorAll(selector)).forEach((element) => {
        resolve(element);
        //Once we have resolved we don't need the observer anymore.
        observer.disconnect();
      });
    }).observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  });
}

let lastUrl = location.href;
// create an observer to keep an eye on url changes.
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    onUrlChange();
  }
}).observe(document, { subtree: true, childList: true });

function isPullRequestUrl() {
  const isPullRequestRegex = /\/pull\/\d+$/;
  console.log("URL Tested!", location.pathname);

  return isPullRequestRegex.test(location.pathname);
}

function onUrlChange() {
  if (isPullRequestUrl()) {
    elementReady(".js-issue-sidebar-form").then(() => constructButtons());
  }
}

if (isPullRequestUrl()) {
  if (constructButtons()) {
    console.log("sucessfully Added");
  } else {
    console.log("No luck");
  }
} else {
  console.log("not A pull Request");
}

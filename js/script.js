const apiInput = document.getElementById('apiInput');
const apiInputValue = () => document.getElementById('apiInput').value;
const apiForm = document.getElementById('apiForm');
const shortenedUrlsObject = {};

apiForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (validateForm()) {
    apiRequest();
    apiRequest().catch((error) => {
      addFormErrorMessage(error);
      addInputErrorStatus();
    });
  }
});

// TODO: potrei usare sweetalert per gli errorio
// TODO: sistemare sfondo get started
// TODO: sistemare nav social footer
async function apiRequest() {
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${apiInputValue()}`)
    .then((res) => res.json());
  if (response.ok) {
    shortenedUrlsObject[response.result.original_link] = response.result.short_link;
  } else {
    throw new Error(response.error);
  }
}

function validateForm() {
  if (apiInputValue()) {
    removeInputErrorStatus();
    removeFormErrorMessage();
    return true;
  }
  addInputErrorStatus();
  addFormErrorMessage('Please add a link.');
  return false;
}

function addInputErrorStatus() {
  apiInput.classList.add('error');
}

function addFormErrorMessage(errorMessage) {
  apiInput.insertAdjacentHTML('afterend', `<span id="apiErrorMessage" class="api__error-message">${errorMessage}</span>`);
}

function removeInputErrorStatus() {
  apiInput.classList.remove('error');
}

function removeFormErrorMessage() {
  const formErrorMessage = document.getElementById('apiErrorMessage');
  if (formErrorMessage) formErrorMessage.remove();
}

const apiButton = document.getElementById('apiButton');
const apiInput = document.getElementById('apiInput');
const apiInputValue = () => document.getElementById('apiInput').value;
const apiForm = document.getElementById('apiForm');
const shortenedUrlsObject = localStorage.getItem('urlShorteningAPI') ? JSON.parse(localStorage.getItem('urlShorteningAPI')) : {};

updateDOM();
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

// TODO: sistemare sfondo get started
// TODO: sistemare nav social footer
async function apiRequest() {
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${apiInputValue()}`)
    .then((res) => res.json());
  if (response.ok) {
    shortenedUrlsObject[response.result.original_link] = response.result.short_link;
    updateDOM();
    updateLocalStorage();
  } else {
    throw new Error(response.error);
  }
}

function validateForm() {
  removeInputErrorStatus();
  removeFormErrorMessage();
  if (apiInputValue()) {
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
  const apiErrorMessage = document.getElementById('apiErrorMessage');
  if (apiErrorMessage) {
    apiErrorMessage.innerHTML = errorMessage;
  } else {
    apiButton.insertAdjacentHTML('afterend', `<span id="apiErrorMessage" class="api__error-message">${errorMessage}</span>`);
  }
}

function removeInputErrorStatus() {
  apiInput.classList.remove('error');
}

function removeFormErrorMessage() {
  const formErrorMessage = document.getElementById('apiErrorMessage');
  if (formErrorMessage) formErrorMessage.remove();
}

function updateLocalStorage() {
  localStorage.setItem('urlShorteningAPI', JSON.stringify(shortenedUrlsObject));
}

function updateDOM() {
  apiInput.value = '';
  if (shortenedUrlsObject) {
    if (!document.getElementById('apiLinksContainer')) {
      createAPILinksContainer();
    }
    generateAPILinks();
  } else {
    removeAPIListContainer();
  }
}

function createAPILinksContainer() {
  apiForm.insertAdjacentHTML('afterend', '<ul id="apiLinksContainer" class="api-links-container "></ul>');
}

function generateAPILinks() {
  const apiLinksContainer = document.getElementById('apiLinksContainer');
  apiLinksContainer.innerHTML = '';
  Object.keys(shortenedUrlsObject).forEach((link) => {
    // console.log(shortenedUrlsObject[link]);
    apiLinksContainer.insertAdjacentHTML('beforeend', APILInksSyntax(link, shortenedUrlsObject[link]));
  });
}

function removeAPIListContainer() {
  document.getElementById('apiListContainer').remove();
}

// TODO: Add close button?
function APILInksSyntax(originalLink, shortenedLink) {
  return ` <li class="box-link api__link ">
                <div class="api__link__url-container"><span class="api__link__url ">${originalLink}</span></div>
                <div class="api__link__link-container"><a href="#" id="apiShortenedLink" class="api__link__link">${shortenedLink}</a></div>
                <div class="api__link__button-container"><button class="api__link__button button-rectangle button--small button-cyan " data-clipboard-target="#apiShortenedLink">Copy</button></div>
              </li>`;
}

// eslint-disable-next-line
new ClipboardJS('.api__link__button');

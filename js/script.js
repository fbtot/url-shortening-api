const menu = document.getElementById('menu');
const menuButton = document.getElementById('menuButton');
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
    copyButtonClicked();
    deleteLink();
    apiRequest().catch((error) => {
      addFormErrorMessage(error);
      addInputErrorStatus();
    });
  }
});

// TODO: Menu mobile
async function apiRequest() {
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${apiInputValue()}`)
    .then((res) => res.json());
  if (response.ok) {
    if (!shortenedUrlsObject[response.result.original_link]) {
      shortenedUrlsObject[response.result.original_link] = response.result.full_short_link;
      updateDOM();
      updateLocalStorage();
    } else {
      apiInput.value = '';
    }
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
    copyButtonClicked();
    deleteLink();
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
    apiLinksContainer.insertAdjacentHTML('afterbegin', APILInksSyntax(link));
  });
}

function removeAPIListContainer() {
  document.getElementById('apiListContainer').remove();
}

// TODO: Add close button?
// TODO: sistemare sfondo sezione get started  mobile
function APILInksSyntax(originalLink) {
  const shortenedLink = shortenedUrlsObject[originalLink];
  const randomID = generateRandomID();
  return ` <li class="box-link api__link " id="${randomID}">
                <div class="api__link__url-container"><span class="api__link__url ">${originalLink}</span></div>
                <div class="api__link__link-container"><a href="${shortenedLink}" id="${randomID}-link" class="api__link__link">${shortenedLink}</a></div>
                <div class="api__link__copy-button-container"><button class="api__link__copy-button button-rectangle button--small button-cyan " data-clipboard-target="#${randomID}-link">Copy</button></div>
                <div class="api__link__delete-button-container"><button class="api__link__delete-button button-rectangle button--small invisible-button" ><i class="bx bx-x"></i></button></div>
              </li>`;
}

// eslint-disable-next-line
new ClipboardJS('.api__link__copy-button');

function copyButtonClicked() {
  const apiLinkButtons = document.getElementsByClassName('api__link__copy-button');
  Array.from(apiLinkButtons).forEach((link) => {
    link.addEventListener('click', () => {
      link.classList.add('active');
      // eslint-disable-next-line
      link.textContent = 'Copied!';
    });
  });
}
copyButtonClicked();

function deleteLink() {
  const deleteLinkButtons = document.getElementsByClassName('api__link__delete-button');
  Array.from(deleteLinkButtons).forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const thisOriginalLink = getThisComment(link).querySelector('.api__link__url').innerText;
      delete shortenedUrlsObject[thisOriginalLink];
      updateLocalStorage();
      updateDOM();
      // getThisComment(link).remove();
    });
  });
}
deleteLink();

function generateRandomID() {
  return `id${Math.floor(Math.random() * 10000000)}`;
}

function getThisComment(el) {
  return el.closest('.api__link');
}

menuButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (menu.classList.contains('active')) {
    closeMenu(menu);
  } else {
    openMenu(menu);
  }
});

window.addEventListener('resize', () => {
  if (menu.classList.contains('active')) {
    closeMenu(menu);
  }
});

function openMenu(el) {
  el.classList.add('active', 'animate__animated', 'animate__fadeInDown', 'animate__faster');
}

function closeMenu(el) {
  el.classList.remove('animate__fadeInDown');
  el.classList.add('animate__fadeOutUp');

  setTimeout(() => {
    el.classList.remove('active', 'animate__fadeOutUp', 'animate__faster', 'animate__animated');
  }, 500);
}

import { getElement, SELECTORS } from "./static-selectors";
const show = (parent = null) => {
  const mainWrapper = parent || getElement(SELECTORS.MAIN_WRAPPER);
  hide();
  _blur();
  const loadingContainer = _create();
  mainWrapper.appendChild(loadingContainer);
};

const _blur = () => {
  const container = getElement(SELECTORS.MAIN_CONTAINER);
  container.style.filter = "blur(4px)";
};

const _unblur = () => {
  const container = getElement(SELECTORS.MAIN_CONTAINER);
  container.style.filter = "none";
};

const _create = () => {
  const loadingContainer = document.createElement("div");
  loadingContainer.id = SELECTORS.LOADING_CONTAINER;
  loadingContainer.classList.add("ceb-loading-container");
  loadingContainer.style.display = "flex";
  loadingContainer.style.justifyContent = "center";
  loadingContainer.style.alignItems = "center";
  loadingContainer.style.width = "100%";
  loadingContainer.style.height = "100%";
  loadingContainer.style.position = "absolute";
  loadingContainer.style.top = "0";
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  Array.from({ length: 12 }, (_, i) => {
    const circle = document.createElement("div");
    circle.classList.add(`bar${i + 1}`);
    spinner.appendChild(circle);
  });
  loadingContainer.appendChild(spinner);
  return loadingContainer;
};

const hide = (parent = null) => {
  const mainWrapper = parent || getElement(SELECTORS.MAIN_WRAPPER);
  _unblur(mainWrapper);
  getElement(SELECTORS.LOADING_CONTAINER)?.remove();
};

export default {
  show,
  hide,
};

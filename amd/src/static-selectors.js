// static-selectors.js
import {dropDownTemplate} from "./templates";
import {get_string as getString} from 'core/str';

// Per-instance state
const instances = {};

export const setInstanceId = (id) => {
  if (!instances[id]) {
    instances[id] = {
      root: document.getElementById('id-' + id),
      dropDownData: null,
      filterState: {
        QUERY: null,
        CURRENT_PAGE: 0,
        PAGE_SIZE: 12,
        ORDER: null,
      }
    };
    for (const key in FIELD_FILTER_MAP) {
      instances[id].filterState[FIELD_FILTER_MAP[key]] = null;
    }
  }
  currentInstance = instances[id];
};

let currentInstance = null; // active instance context

const getInstance = (id) => instances[id];

export const getElement = (id, selector) => {
  const instance = getInstance(id);
  if (!instance?.root) {
    console.warn("No instance root set. Call setInstanceId(id) first.");
    return null;
  }
  return instance.root.querySelector(`#${selector}`);
};

export const initDropDownData = (data) => {
  currentInstance.dropDownData = data;
};

export const getFilterState = () => currentInstance.filterState;

export const updateFilterState = (type, param) => {
  const filterState = currentInstance.filterState;
  if (param === null) return false;
  const state = filterState[type];
  if (state !== param) {
    filterState.CURRENT_PAGE = 0;
    filterState[type] = param;
    return true;
  }
  return false;
};

const resetFilterStateByType = (type) => {
  if (currentInstance.filterState[type] === null) return false;
  currentInstance.filterState[type] = null;
  return true;
};

export const prepareDropDowns = async(handleFilter, activeFilters, triggeredFilter, reset = false) => {
  const dropdownContainer = getElement(SELECTORS.DROPDOWN_CONTAINER);
  const dropDowns = [];
  for (const filter of currentInstance.dropDownData) {
    const selectedOption = currentInstance.filterState[FIELD_FILTER_MAP[filter.name]];
    const defaultOption = selectedOption !== null ? filter.options.find(opt => opt.id == selectedOption) : null;

    if (activeFilters && triggeredFilter) {
      const activeFilter = activeFilters.find(af => af.name === filter.name);
      filter.options.forEach(option => {
        if (filter.name === triggeredFilter && !reset) return;
        const match = activeFilter?.options.find(of => of.name === option.name);
        option.disabled = match === undefined;
      });
    }

    const caption = await getString(FIELD_FILTER_MAP[filter.name].toLowerCase() + 'filtercaption', 'block_mat_explorer');
    const dropDown = dropDownTemplate({
      title: caption,
      caption: defaultOption?.name || caption,
      options: filter.options,
      selectedOption: defaultOption,
      onOptionChange: (optionId) => {
        if (updateFilterState(FIELD_FILTER_MAP[filter.name], optionId)) {
          const filteredCourses = handleFilter();
          const filters = getFiltersFromTargets(filteredCourses);
          prepareDropDowns(handleFilter, filters, filter.name);
        }
      },
      onReset: () => {
        if (resetFilterStateByType(FIELD_FILTER_MAP[filter.name])) {
          const filteredCourses = handleFilter();
          const filters = getFiltersFromTargets(filteredCourses);
          prepareDropDowns(handleFilter, filters, filter.name, true);
        }
      },
      className: "mat-dropdown-" + filter.name.toLowerCase(),
    });
    dropDowns.push(dropDown);
  }
  $(dropdownContainer).empty().append(dropDowns);
};

export const updateMainContainer = (elements) => {
  const mainContainer = getElement(SELECTORS.MAIN_CONTAINER);
  $(mainContainer).empty().append(elements);
};

export const initiateSearch = (handleFilter) => {
  const searchInput = getElement(SELECTORS.SEARCH_INPUT);
  const clearButton = getElement(SELECTORS.SEARCH_CLEAR_BUTTON);

  searchInput.addEventListener("keyup", (e) => {
    if (updateFilterState(FILTER_TYPES.QUERY, e.target.value)) {
      handleFilter(getFilterState());
    }
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = "";
    if (updateFilterState(FILTER_TYPES.QUERY, "")) {
      handleFilter(getFilterState());
    }
  });
};

export const updateCourseCount = async(count) => {
  const courseCount = getElement(SELECTORS.COURSE_COUNT);
  const caption = await getString(count !== 1 ? 'coursecountcaption' : 'coursecountonecaption', 'block_mat_explorer');
  courseCount.innerHTML = `${count || "0"} ${caption}`;
};

export const prepareSortDropdown = async(handleFilter) => {
  const container = getElement(SELECTORS.SORT_DROPDOWN_CONTAINER);
  const options = Object.entries(SORT_TYPES).map(([id, { name }]) => ({ id, name }));
  const selected = currentInstance.filterState.ORDER;
  const defaultOption = selected ? options.find(o => o.id === selected) : null;
  const caption = await getString('sortcaption', 'block_mat_explorer');

  const sortDropDown = await dropDownTemplate({
    title: caption,
    caption: defaultOption?.name || caption,
    options,
    selectedOption: defaultOption,
    onOptionChange: (optionId) => {
      if (updateFilterState(FILTER_TYPES.ORDER, optionId)) {
        handleFilter();
        prepareSortDropdown(handleFilter);
      }
    },
    onReset: () => {
      if (resetFilterStateByType(FILTER_TYPES.ORDER)) {
        handleFilter();
        prepareSortDropdown(handleFilter);
      }
    }
  });

  $(container).empty().append(sortDropDown);
};

// Constants
export const SELECTORS = {
  MAIN_WRAPPER: "matMainWrapper",
  MAIN_CONTAINER: "matMainContainer",
  DROPDOWN_CONTAINER: "matDropDownContainer",
  LOADING_CONTAINER: "matLoadingContainer",
  SEARCH_INPUT: "matSearchInput",
  SEARCH_CLEAR_BUTTON: "matClearSearch",
  COURSE_COUNT: "matCourseCount",
  TOP_PAGINATION_CONTAINER: "matTopPaginationContainer",
  BOTTOM_PAGINATION_CONTAINER: "matBottomPaginationContainer",
  SORT_DROPDOWN_CONTAINER: "matSortContainer",
  COURSE_DETAIL_MODAL: "mat_modal",
};

export const FILTER_TYPES = {
  QUERY: "QUERY",
  CATEGORY: "CATEGORY",
  TOPICS: "TOPICS",
  TARGET_GROUP: "TARGET_GROUP",
  CURRENT_PAGE: "CURRENT_PAGE",
  ORDER: "ORDER",
};

export const FIELD_FILTER_MAP = {
  category: "CATEGORY",
  mc_moodle_themen: "TOPICS",
  mc_moodle_zielgruppe: "TARGET_GROUP",
};

export const SORT_TYPES = {
  alphabetASC: { field: "title", direction: 1, name: "Alphabetisch aufsteigend" },
  alphabetDESC: { field: "title", direction: -1, name: "Alphabetisch absteigend" },
  mcOriginalDESC: { field: "MCOriginal", direction: -1, name: "MINT-Campus-Original zuerst" },
  favouritesDESC: { field: "favourite", direction: -1, name: "Favoriten zuerst" },
};

getString('sortalphabetasc', 'block_mat_explorer').then(str => SORT_TYPES.alphabetASC.name = str);
getString('sortalphabetdesc', 'block_mat_explorer').then(str => SORT_TYPES.alphabetDESC.name = str);
getString('sortmcoriginaldesc', 'block_mat_explorer').then(str => SORT_TYPES.mcOriginalDESC.name = str);
getString('sortfavouritesdesc', 'block_mat_explorer').then(str => SORT_TYPES.favouritesDESC.name = str);

const getEmptyFilters = (keys) => keys.map((key) => ({ name: key, options: [] }));

const getFilterOptionsFromTargetsByKey = (key, targets) => {
  const optionsCount = {};
  for (const target of targets) {
    const field = target[key];
    if (!field) continue;
    const items = Array.isArray(field) ? field : [field];
    for (const item of items) {
      if (!item?.id) continue;
      if (optionsCount[item.id]) {
        optionsCount[item.id].count++;
      } else {
        optionsCount[item.id] = { count: 1, value: item.value };
      }
    }
  }
  return Object.entries(optionsCount).map(([id, { count, value }]) => ({ id, name: value, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getFiltersFromTargets = (targets) => {
  const keys = Object.keys(FIELD_FILTER_MAP);
  const filters = getEmptyFilters(keys);
  for (const filter of filters) {
    filter.options = getFilterOptionsFromTargetsByKey(filter.name, targets);
  }
  return filters;
};

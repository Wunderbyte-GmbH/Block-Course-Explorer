import {dropDownTemplate} from "./templates";
import {get_string as getString} from 'core/str';

let dropDownData = null;
let instanceRoot = "";

export const setInstanceId = (id) => {
  instanceRoot = document.getElementById('id-' + id);
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
  mc_moodle_zielgruppe: "TARGET_GROUP"
};
export const SORT_TYPES = {
  alphabetASC: {
    field: "title",
    direction: 1,
    name: 'Alphabetisch aufsteigend'
  },
  alphabetDESC: {
    field: "title",
    direction: -1,
    name: 'Alphabetisch absteigend'
  },
  mcOriginalDESC: {
    field: "MCOriginal",
    direction: -1,
    name: 'MINT-Campus-Original zuerst'
  },
  favouritesDESC: {
    field: "favourite",
    direction: -1,
    name: 'Favoriten zuerst'
  }
};
getString('sortalphabetasc', 'block_course_explorer').then((string) => {
  SORT_TYPES.alphabetASC.name = string;
  return string;
}).catch();
getString('sortalphabetdesc', 'block_course_explorer').then((string) => {
  SORT_TYPES.alphabetDESC.name = string;
  return string;
}).catch();
getString('sortmcoriginaldesc', 'block_course_explorer').then((string) => {
  SORT_TYPES.mcOriginalDESC.name = string;
  return string;
}).catch();
getString('sortfavouritesdesc', 'block_course_explorer').then((string) => {
  SORT_TYPES.favouritesDESC.name = string;
  return string;
}).catch();

export const SELECTORS = {
  MAIN_WRAPPER: "cebMainWrapper",
  MAIN_CONTAINER: "cebMainContainer",
  DROPDOWN_CONTAINER: "cebDropDownContainer",
  LOADING_CONTAINER: "cebLoadingContainer",
  SEARCH_INPUT: "cebSearchInput",
  SEARCH_CLEAR_BUTTON: "cebClearSearch",
  COURSE_COUNT: "cebCourseCount",
  TOP_PAGINATION_CONTAINER: "cebTopPaginationContainer",
  BOTTOM_PAGINATION_CONTAINER: "cebBottomPaginationContainer",
  SORT_DROPDOWN_CONTAINER: "cebSortContainer",
  COURSE_DETAIL_MODAL: "ceb_modal",
};

let filterState = {
  QUERY: null,
  CURRENT_PAGE: 0,
  PAGE_SIZE: 12,
  ORDER: null,
};
for (const key in FIELD_FILTER_MAP) {
  filterState[FIELD_FILTER_MAP[key]] = null;
}

export const getFilterState = () => {
  return filterState;
};

export const updateFilterState = (type, param) => {
  if (param === null) {
    return false;
  }
  const state = filterState[type];
  if (state !== param) {
    filterState.CURRENT_PAGE = 0;
    filterState[type] = param;
    return true;
  }
  return false;
};

const resetFilterStateByType = (type) => {
  if (filterState[type] === null) {
    return false;
  }
  filterState[type] = null;
  return true;
};

export const getElement = (selector) => {
  if (!instanceRoot) {
    console.warn("No instance root set. Call setInstanceId(id) first.");
    return null;
  }
  console.log(instanceRoot);
  return instanceRoot.querySelector(`#${selector}`);
};

export const initDropDownData = (data) => {
  dropDownData = data;
};

export const prepareDropDowns = async(handleFilter, activeFilters, triggeredFilter, reset = false) => {
  const dropdownContainer = getElement(SELECTORS.DROPDOWN_CONTAINER);
  const dropDowns = [];
  let caption = '';
  for (let i = 0; i < dropDownData.length; i++) {
    let filter = dropDownData[i];
    const selectedOption = filterState[FIELD_FILTER_MAP[filter.name]];
    let defaultOption = null;
    if (selectedOption !== null) {
      defaultOption = filter.options.find((option) => option.id == selectedOption) || null;
    }

    const options = filter.options;
    if (activeFilters && triggeredFilter) {
      const activeFilter = activeFilters.find((activeFilter) => activeFilter.name === filter.name);
      options.forEach((option) => {
        if (filter.name === triggeredFilter && !reset) {
          return;
        }
        const match = activeFilter.options.find(filterOption => filterOption.name === option.name);
        option.disabled = match === undefined;
      });
    }

    caption = await getString(FIELD_FILTER_MAP[filter.name].toLowerCase() + 'filtercaption', 'block_course_explorer');
    const dropDown = dropDownTemplate({
      title: caption,
      caption: defaultOption?.name || caption,
      options: options,
      selectedOption: defaultOption,
      onOptionChange: (optionId) => {
        if (updateFilterState(FIELD_FILTER_MAP[filter.name], optionId)) {
          const filteredCourses = handleFilter();
          const filters = getFiltersFromTargets(filteredCourses);
          const triggeredFilter = filter.name;
          prepareDropDowns(handleFilter, filters, triggeredFilter);
        }
      },
      onReset: () => {
        if (resetFilterStateByType(FIELD_FILTER_MAP[filter.name])) {
          const filteredCourses = handleFilter();
          const filters = getFiltersFromTargets(filteredCourses);
          const triggeredFilter = filter.name;
          prepareDropDowns(handleFilter, filters, triggeredFilter, true);
        }
      },
      className: "ceb-dropdown-" + filter.name.toLowerCase(),
    });
    dropDowns.push(dropDown);
  }

  $(dropdownContainer).empty();
  dropDowns.forEach(function(dropDown) {
    $(dropdownContainer).append(dropDown);
  });
};

export const updateMainContainer = (elements) => {
  const mainContainer = getElement(SELECTORS.MAIN_CONTAINER);
  $(mainContainer).empty();
  $(mainContainer).append(elements);
};

export const initiateSearch = (handleFilter) => {
  const searchInput = getElement(SELECTORS.SEARCH_INPUT);
  const searchClearButton = getElement(SELECTORS.SEARCH_CLEAR_BUTTON);

  searchInput.addEventListener("keyup", (e) => {
    if (updateFilterState(FILTER_TYPES.QUERY, e.target.value)) {
      handleFilter(filterState);
    }
  });

  searchClearButton.addEventListener("click", () => {
    searchInput.value = "";
    if (updateFilterState(FILTER_TYPES.QUERY, "")) {
      handleFilter(filterState);
    }
  });
};

export const updateCourseCount = async(count) => {
  const courseCount = getElement(SELECTORS.COURSE_COUNT);
  const caption = await getString(count !== 1 ? 'coursecountcaption' : 'coursecountonecaption', 'block_course_explorer');
  courseCount.innerHTML = `${count || "0"} ${caption}`;
};

export const prepareSortDropdown = async(handleFilter) => {
  const sortDropdownContainer = getElement(SELECTORS.SORT_DROPDOWN_CONTAINER);
  const sortOptions = [];

  for (const key in SORT_TYPES) {
    sortOptions.push({
      id: key, // TODO: rename in key
      name: SORT_TYPES[key].name // TODO: rename in value and description
    });
  }

  const selectedOption = filterState.ORDER;
  let defaultOption = null;
  if (selectedOption !== null) {
    defaultOption = sortOptions.find((option) => option.id == selectedOption) || null;
  }

  const caption = await getString('sortcaption', 'block_course_explorer');
  const sortDropDown = await dropDownTemplate({
    title: caption,
    caption: defaultOption?.name || caption,
    options: sortOptions,
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
  $(sortDropdownContainer).empty();
  $(sortDropdownContainer).append(sortDropDown);
};


const getEmptyFilters = (keys) => {
  const filters = [];
  keys.forEach((key) => {
    filters.push({
      name: key,
      options: []
    });
  });
  return filters;
};

const getFilterOptionsFromTargetsByKey = (key, targets) => {
  let filterOptions = [];
  const optionsCount = {};
  targets.forEach((target) => {
    if (target[key] === undefined || target[key] === null || target[key] === '') {
      return;
    }
    if (Array.isArray(target[key])) {
      target[key].forEach((item) => {
        if (optionsCount[item.id]) {
          optionsCount[item.id].count++;
        } else {
          optionsCount[item.id] = {
            count: 1,
            value: item.value
          };
        }
      });
    } else {
      if (optionsCount[target[key].id]) {
        optionsCount[target[key].id].count++;
      } else {
        optionsCount[target[key].id] = {
          count: 1,
          value: target[key].value
        };
      }
    }
  });
  for (const option in optionsCount) {
    filterOptions.push({
      id: option,
      name: optionsCount[option].value,
      count: optionsCount[option].count
    });
  }

  return filterOptions.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  });
};

export const getFiltersFromTargets = (targets) => {
  const keys = [];
  for (const key in FIELD_FILTER_MAP) {
    keys.push(key);
  }
  const filters = getEmptyFilters(keys);

  filters.forEach((filter) => {
    filter.options = getFilterOptionsFromTargetsByKey(filter.name, targets);
  });

  return filters;
};

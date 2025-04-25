/**
 * Bla-bla
 */
import {setWsToken} from "./token";
import {getCourseDetailsById, getCourses} from "./api";
import {courseCardTemplate} from "./templates";
import * as loading from "./loading";
import {
  FIELD_FILTER_MAP,
  FILTER_TYPES,
  SELECTORS,
  SORT_TYPES,
  updateFilterState,
  updateMainContainer,
  initDropDownData,
  prepareDropDowns,
  initiateSearch,
  updateCourseCount,
  getFilterState,
  prepareSortDropdown,
  getFiltersFromTargets,
  getElement,
  setInstanceId
} from "./static-selectors";
import {createPagination} from "./pagination";

let courses = [];
let courseDetailsMap = new Map();

const handleFilter = () => {
  let filteredCourses = [...courses];
  const filterStates = getFilterState();

  if (filterStates[FILTER_TYPES.QUERY] !== null) {
    const toSearch = filterStates[FILTER_TYPES.QUERY].toLowerCase();
    filteredCourses = filteredCourses.filter((course) => {
      return (
          course.title.toLowerCase().includes(toSearch) ||
          course.description.toLowerCase().includes(toSearch)
      );
    });
  }
  for (const key in FIELD_FILTER_MAP) {
    if (filterStates[FIELD_FILTER_MAP[key]] !== null) {
      filteredCourses = filteredCourses.filter((course) => {
        if (Array.isArray(course[key])) {
          const arr = course[key].map(obj => obj.id);
          return arr.includes(filterStates[FIELD_FILTER_MAP[key]]);
        } else {
          return course[key].id === filterStates[FIELD_FILTER_MAP[key]];
        }
      });
    }
  }

  if (filterStates.ORDER) {
    const {direction, field} = SORT_TYPES[filterStates.ORDER];
    filteredCourses.sort((a, b) => {
      if (a[field] > b[field]) {
        return direction;
      } else if (a[field] < b[field]) {
        return -direction;
      } else {
        return 0;
      }
    });
  }
  const returnValues = [...filteredCourses];

  updateCourseCount(filteredCourses.length);
  initiatePagination({
    currentPage: filterStates.CURRENT_PAGE + 1,
    total: filteredCourses.length,
    perPage: filterStates.PAGE_SIZE,
  });
  updateMainContainer(
    filteredCourses
      .splice(filterStates.CURRENT_PAGE * filterStates.PAGE_SIZE, filterStates.PAGE_SIZE)
      .map((course) => courseCardTemplate(course))
  );

  return returnValues;
};

const initiatePagination = ({ currentPage, total, perPage }) => {
  createPagination({
    container: getElement("cebTopPaginationContainer"),
    currentPage,
    total,
    perPage,
    onChange: (page) => {
      if (updateFilterState(FILTER_TYPES.CURRENT_PAGE, page - 1)) {
        handleFilter();
      }
    },
  });

  createPagination({
    container: getElement("cebBottomPaginationContainer"),
    currentPage,
    total,
    perPage,
    onChange: (page) => {
      if (updateFilterState(FILTER_TYPES.CURRENT_PAGE, page - 1)) {
        handleFilter();
      }
    },
  });
};

export const init = ({wsToken, categoryids, userid, instanceId}) => {
  setWsToken(wsToken);
  console.log(instanceId);
  setInstanceId(instanceId);
  loading.show();
  getCourses(
      categoryids,
      userid,
      (response) => {
        if (response) {
          courses = response;
          const initFilters = getFiltersFromTargets(courses);
          initiateSearch(handleFilter);
          initDropDownData(initFilters);
          prepareDropDowns(handleFilter, initFilters, null);
          prepareSortDropdown(handleFilter);
          handleFilter();

          setTimeout(() => {
            loading.hide();
          }, 1000);
        }
      });
};

/**
 * Bla-bla
 */

import {setWsToken} from "../token";
import {getMyCourses} from "../api";
import {courseCardTemplate} from "./templates";
import * as loading from "../loading";
import { getElement, setInstanceId } from "../static-selectors";
import {
  FILTER_TYPES,
  updateFilterState,
  updateMainContainer,
  initiateSearch,
  updateCourseCount,
  getFilterState,
  prepareSortDropdown,
  SORT_TYPES,
} from "../static-selectors";
import {createPagination} from "../pagination";

let courses = [];

const handleFilter = () => {
  let filteredCourses = courses.filter(course => course.ismaterial === true);
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
      .slice(filterStates.CURRENT_PAGE * filterStates.PAGE_SIZE, (filterStates.CURRENT_PAGE + 1) * filterStates.PAGE_SIZE)
      .map((course) => courseCardTemplate(course))
  );

  return returnValues;
};

const initiatePagination = ({currentPage, total, perPage}) => {
  createPagination({
    container: getElement("matTopPaginationContainer"),
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
    container: getElement("matBottomPaginationContainer"),
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

export const init = ({wsToken, userid, instanceId}) => {
  setInstanceId(instanceId);
  setWsToken(wsToken);
  loading.show();
  getMyCourses(
    userid,
    (response) => {
      if (response) {
        courses = response;
        initiateSearch(handleFilter);
        prepareSortDropdown(handleFilter);
        handleFilter();

        setTimeout(() => {
          loading.hide();
        }, 1000);
      }
    });
};

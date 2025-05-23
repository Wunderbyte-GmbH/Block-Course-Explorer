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

export const init = ({wsToken, userid, instanceId}) => {
  setInstanceId(instanceId);
  setWsToken(wsToken);
  loading.show();

  getMyCourses(userid, (response) => {
    if (!Array.isArray(response)) {
      console.error("Expected array response but got:", response);
      return;
    }

    const courses = response;

    const handleFilter = () => {
      const filterStates = getFilterState();
      let filteredCourses = courses.filter(course => course.ismaterial === false);

      if (filterStates[FILTER_TYPES.QUERY]) {
        const search = filterStates[FILTER_TYPES.QUERY].toLowerCase();
        filteredCourses = filteredCourses.filter(course =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search)
        );
      }

      if (filterStates.ORDER) {
        const {direction, field} = SORT_TYPES[filterStates.ORDER];
        filteredCourses.sort((a, b) => {
          if (a[field] > b[field]) return direction;
          if (a[field] < b[field]) return -direction;
          return 0;
        });
      }

      updateCourseCount(filteredCourses.length);
      initiatePagination({
        currentPage: filterStates.CURRENT_PAGE + 1,
        total: filteredCourses.length,
        perPage: filterStates.PAGE_SIZE,
      });

      updateMainContainer(
        filteredCourses
          .slice(filterStates.CURRENT_PAGE * filterStates.PAGE_SIZE, (filterStates.CURRENT_PAGE + 1) * filterStates.PAGE_SIZE)
          .map(courseCardTemplate)
      );

      return filteredCourses;
    };

    const initiatePagination = ({currentPage, total, perPage}) => {
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

    initiateSearch(handleFilter);
    prepareSortDropdown(handleFilter);
    handleFilter();

    setTimeout(() => loading.hide(), 1000);
  });
};

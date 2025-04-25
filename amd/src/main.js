// main.js
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
  setInstanceId
} from "./static-selectors";
import {createPagination} from "./pagination";

export const init = ({wsToken, categoryids, userid, instanceId}) => {
  setInstanceId(instanceId);
  setWsToken(wsToken);
  loading.show();

  getCourses(categoryids, userid, (response) => {
    if (!Array.isArray(response)) {
      console.error("Expected course array, got:", response);
      return;
    }

    const courses = response;
    const filters = getFiltersFromTargets(courses);

    const handleFilter = () => {
      const filterStates = getFilterState();
      let filteredCourses = [...courses];

      if (filterStates[FILTER_TYPES.QUERY]) {
        const search = filterStates[FILTER_TYPES.QUERY].toLowerCase();
        filteredCourses = filteredCourses.filter(course =>
          course.title.toLowerCase().includes(search) ||
          course.description.toLowerCase().includes(search)
        );
      }

      for (const key in FIELD_FILTER_MAP) {
        const stateKey = FIELD_FILTER_MAP[key];
        const value = filterStates[stateKey];
        if (value !== null) {
          filteredCourses = filteredCourses.filter(course => {
            const field = course[key];
            if (Array.isArray(field)) {
              return field.some(item => item.id === value);
            }
            return field?.id === value;
          });
        }
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
        container: document.getElementById(`${instanceId}-${SELECTORS.TOP_PAGINATION_CONTAINER}`),
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
        container: document.getElementById(`${instanceId}-${SELECTORS.BOTTOM_PAGINATION_CONTAINER}`),
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
    initDropDownData(filters);
    prepareDropDowns(handleFilter, filters, null);
    prepareSortDropdown(handleFilter);
    handleFilter();

    setTimeout(() => loading.hide(), 1000);
  });
};

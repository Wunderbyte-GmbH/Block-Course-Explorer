import Notification from "core/notification";
import $ from "jquery";

let openCourseEnabled = true;

export const courseCardTemplate = (values) => {
    const elementDefinition = `
    <div class="card course-card ${values.userEnrolled ? 'to-course' : 'enrol-into-course'}" data-id="${values.id}" tabindex="0">
        <div class="card-content"></div>
    </div>`;
    const element = $(elementDefinition);
    const frontTemplate = courseCardFrontTemplate(values);
    element.find('.card-content').append(frontTemplate);

    // Handling course enrolment after clicking on primary card action button
    const clickHandler = function() {
        if (!openCourseEnabled) {
            return;
        }
        let url;
        if (values.userEnrolled) {
            url = '/course/view.php?id=' + values.id;
            window.location.href = window.location.href.replace(window.location.pathname, url);
        } else {
            url = '/blocks/course_explorer/ajax/enrol_user_into_course.php?courseid=' + values.id;
            fetch(url, {
                method: "GET",
            })
                .then((response) => response.json())
                .then((result) => {
                    if (result.enrolled) {
                        url = '/course/view.php?id=' + values.id;
                        window.location.href = window.location.href.replace(window.location.pathname, url);
                    } else {
                        Notification.alert('Error', result.errormessage, 'Close');
                    }
                    return console.log(result);
                })
                .catch((error) => console.log(error));
        }
    };
    element.click(clickHandler);
    element.keyup((event) => {
        if (event.originalEvent instanceof KeyboardEvent
            && event.key.toLocaleLowerCase() !== 'enter') {
            return;
        }
        clickHandler();
    });

    return element;
};

const truncateString = (str, length) => {
    if (str.length <= length) {
        return str; // Return the original string if it's already within or equal to 100 characters
    } else {
        return str.slice(0, length) + '...'; // Cut the string at 100 characters and add an ellipsis
    }
};

const getDesc = (description) => {
    if (description.trim() !== '') {
        return description;
    } else {
        return "lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit." +
            " lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    }
};

const courseCardFrontTemplate = (
    {
        title,
        mcoriginal,
        image,
        description,
        score,
        reviewsnum,
        senderName,
        mc_moodle_format,
        mc_moodle_kursdauer,
        mc_moodle_themen
    }
) => {
    title = truncateString(title, 100);
    let courseCardDescription = getDesc(description);
    courseCardDescription = truncateString(courseCardDescription, 150);

    const courseType = mc_moodle_format;
    const duration = mc_moodle_kursdauer;
    const topics = mc_moodle_themen?.map(topic => topic.value);
    console.log("test");
    return $(`
        <div class="card shadow-sm rounded" style="width: 20rem;">
          <div class="position-relative">
            ${image ? `<img src="${image}" class="card-img-top" alt="">` : `<img src="https://picsum.photos/2124" class="card-img-top" alt="">`}
            <span class="badge badge-light position-absolute" style="top: 0.5rem; left: 0.5rem;">ko-kreativ</span>
            ${mcoriginal ? `<span class="badge badge-warning font-weight-bold position-absolute" style="top: 0.5rem; right: 0.5rem;">MC-Original</span>` : ""}
          </div>
          <div class="card-body bg-light">
            <small class="text-uppercase text-muted">Material</small>
            <h5 class="card-title mt-1 font-weight-bold text-dark">${title}</h5>
            <p class="card-text mb-1"><strong>${senderName}</strong></p>
            <div class="d-flex flex-wrap text-muted mb-2 small">
              <div class="mr-3 d-flex align-items-center">
                <i class="fa fa-graduation-cap mr-1"></i> ${courseType}
              </div>
              <div class="mr-3 d-flex align-items-center">
                <i class="fa fa-clock-o mr-1"></i> ${duration}
              </div>
              <div class="d-flex align-items-center">
                ${getRating(score, reviewsnum)}
              </div>
            </div>
            <p class="card-text">${courseCardDescription}</p>
            ${topics?.length > 0 ? `
              <div class="d-flex align-items-center mt-2">
                <i class="fa fa-tag mr-2 text-muted"></i>
                <span class="text-muted">${topics.join(', ')}</span>
              </div>` : ""
            }
          </div>
        </div>
      `);
};

const getRating = (score, reviewsnum) => {
    reviewsnum = reviewsnum ?? 0;
    let firstStarClass = 'fa-star-o';
    let secondStarClass = 'fa-star-o';
    let thirdStarClass = 'fa-star-o';
    if (score) {
        score = score * (3 / 5);
        if (score < 0.75) {
            firstStarClass = 'fa-star-half-o';
        } else if (score < 1.25) {
            firstStarClass = 'fa-star';
        } else if (score < 1.75) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star-half-o';
        } else if (score < 2.25) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
        } else if (score < 2.75) {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
            thirdStarClass = 'fa-star-half-o';
        } else {
            firstStarClass = 'fa-star';
            secondStarClass = 'fa-star';
            thirdStarClass = 'fa-star';
        }
    }

    return `<i class="fa ${firstStarClass}"></i>
            <i class="fa ${secondStarClass}"></i>
            <i class="fa ${thirdStarClass} mr-1"></i>
            <span>(${reviewsnum})</span>`;
};

export const dropDownTemplate = (
    {
        title,
        caption,
        options,
        onOptionChange,
        selectedOption,
        onReset,
        className = "",
    }
) => {
    let dropDown = $(`<div class="dropdown-container ${className}"></div>`);
    if (selectedOption) {
        const resetDropdown = $(`<button class='btn reset-dropdown'><i class='fa fa-times'></i></button>`);
        resetDropdown.click(onReset);
        dropDown.append(resetDropdown);
    }
    dropDown.append(`
    <button type="button" class="btn btn-outline-secondary dropdown-toggle" data-toggle="dropdown" 
    style="width: 100%;" aria-haspopup="true" aria-expanded="false" title="${title}">
        <div class="text-container" data-active-item-text>
            <div class="text">${caption}</div>
        </div>
    </button>`);
    const optionsMenu = $(`<div role="menu" class="dropdown-menu dropdown-menu-right list-group hidden" 
    data-show-active-item data-skip-active-class="true"></div>`);
    options.forEach((option) => {
        const disabledAttribute = option?.disabled ? 'disabled' : '';
        const isActive = selectedOption?.id === option.id;
        const dropdownItem = $(`
        <a class="dropdown-item ${disabledAttribute}" data-value="${option.id}" 
        aria-current="${isActive}" tabindex="-1" role="menuitem">
            ${option.name}
        </a>`);
        dropdownItem.click(() => onOptionChange(dropdownItem.data().value));
        dropdownItem.keydown((event) => {
            if (event.originalEvent instanceof KeyboardEvent && event.key.toLocaleLowerCase() === 'enter') {
                return onOptionChange(dropdownItem.data().value);
            }
            return null;
        });
        optionsMenu.append(dropdownItem);
    });
    dropDown.append(optionsMenu);

    return dropDown;
};
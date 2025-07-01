import Notification from "core/notification";
import $ from "jquery";

export const courseCardTemplate = (values) => {
  const elementDefinition = `
  <div class="card course-card ${values.userEnrolled ? 'to-course' : 'enrol-into-course'}" data-id="${values.id}" tabindex="0">
    <div class="card-content">
    <div class="card-front">
      ${courseCardFrontTemplate(values)}
    </div>
    </div>
  </div>`;
  const element = $(elementDefinition);

  // Handling course enrolment after clicking on primary card action button
    const clickHandler = function() {
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
        MCOriginal,
        image,
        description,
        score,
        reviewsnum,
        senderName,
        courseType,
        duration,
        topics,
        favourite
    }
) => {
    title = truncateString(title, 100);
    let courseCardDescription = getDesc(description);
    courseCardDescription = truncateString(courseCardDescription, 150);

    topics = topics?.map(topic => topic.value);
    const heartIconName = favourite ? "heart-filled.png" : "heart-outline.png";

    return `
        <div class="card shadow-sm rounded" style="width: 20rem;">
          <div class="position-relative">
            ${image ? `<img src="${image}" class="card-img-top" alt="">` : `<img src="https://picsum.photos/2124" class="card-img-top" alt="">`}
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
      `;
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
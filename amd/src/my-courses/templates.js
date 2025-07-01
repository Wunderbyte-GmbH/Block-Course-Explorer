import Notification from "core/notification";
import $ from "jquery";

export const courseCardTemplate = (values) => {
  const elementDefinition = `
  <div class="card course-card ${values.userEnrolled ? 'to-course' : 'enrol-into-course'}" data-id="${values.id}" tabindex="0">
      ${courseCardFrontTemplate(values)}
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
    const svgClockIcon = `
    <div class="icon-container d-flex justify-content-center align-items-center" style="height: 20px; width: 20px; transform: rotate(0deg) scaleX(1) scaleY(1);">
      <svg xmlns="http://www.w3.org/2000/svg" width="128" height="140" viewBox="0 0 128 140" style="max-width: 100%; max-height: 100%;">
        <g id="Icons">
          <g id="Pulpo">
            <path id="Uhr" d="M64,26.55c-27.62,0-50,22.38-50,50s22.38,50,50,50,50-22.38,50-50-22.38-50-50-50Zm18.65,63.1l-4.03,5.04
              c-.26.33-.59.61-.96.81-.37.2-.78.33-1.2.38-.42.05-.85.01-1.25-.11-.41-.12-.79-.31-1.12-.58l-13.51-10.02
              c-.94-.76-1.71-1.71-2.23-2.8-.52-1.09-.79-2.28-.79-3.49v-31.36c0-.86.34-1.68.94-2.28.6-.6,1.43-.94,2.28-.94h6.45
              c.86,0,1.68.34,2.28.94.6.6.94,1.43.94,2.28v29.03l11.69,8.57c.33.26.61.59.81.96s.33.78.38,1.2c.05.42,0,.85-.11,1.25
              -.12.41-.32.79-.58,1.12Z" fill="#551c77"/>
          </g>
        </g>
      </svg>
    </div>
  `;
    return `
          <div class="position-relative card-header p-0">
            ${image ? `<img src="${image}" class="card-img-top" alt="">` : `<img src="https://picsum.photos/2124" class="card-img-top" alt="">`}
            ${MCOriginal ? "<div class=\"course-card__label mc-original\">MC-Original</div>" : ""}
            <div class="d-flex flex-wrap text-muted mb-2 small rating">
              <div class="d-flex align-items-center">
                ${getRating(score, reviewsnum)}
              </div>
            </div>
        </div>
          <div class="card-body">
            <div>
                <span class="course-type">${courseType}</span>
                <h2 class="course-title">${title}</h5>
                <p class="card-text mb-1 sender">${senderName}</p>
            </div>
            <div class="mr-3 d-flex align-items-center duration">
                    ${svgClockIcon}
                    <div>${duration}</div>
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
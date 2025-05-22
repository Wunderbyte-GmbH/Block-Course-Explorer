let tokens = {
    courses: {
        endpoint: "/webservice/rest/server.php",
        wstoken: "",
        wsfunction: "local_course_explorer_service_get_course_list",
        moodlewsrestformat: "json",
    },
    coursedetails: {
        endpoint: "/webservice/rest/server.php",
        wstoken: "",
        wsfunction: "local_course_explorer_service_get_course_details",
        moodlewsrestformat: "json",
    },
    mycourses: {
        endpoint: "/webservice/rest/server.php",
        wstoken: "",
        wsfunction: "local_course_explorer_service_get_my_courses",
        moodlewsrestformat: "json",
    }
};

export const setWsToken = (token) => {
    tokens.courses.wstoken = token;
    tokens.coursedetails.wstoken = token;
    tokens.mycourses.wstoken = token;
};

export const getTokens = () => {
    return tokens;
};
import {getTokens} from "./token";
import $ from "jquery";

const tokens = getTokens();
export const getCourses = (categoryids, userid, success) => {
  const {endpoint, ...headers} = tokens.courses;
  const paramets = new URLSearchParams({
    ...headers,
  });

  const url = `${endpoint}?${paramets}&categoryids=${categoryids}&userid=${userid}`;
  console.log(url);
  fetch(url, {
    method: "GET"
  })
    .then((response) => response.json())
    .then((data) => success(data))
    .catch((error) => console.log(error));
};

export const getCourseDetailsById = (id, success) => {
  //   const { endpoint, ...headers } = tokens.coursedetails;
  //   const paramets = new URLSearchParams({
  //     ...headers,
  //   });
  //   const url = `${endpoint}?${paramets}&id=${id}&userid=${userid}`;
  const mockData = {
    id: 1,
    title:
      "Course Title",
    imageUrl: "https://picsum.photos/400/200",
    type: "Course Type",
    duration: 8,
    extraInfo: "Extra Info",
    price: 100,
    venues: Array.from({ length: 16 }, (_, i) => `Venue ${i + 1}`),
    description: [
      `Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Delectus provident voluptatem aspernatur quibusdam sint soluta nostrum voluptate quas 
      amet aperiam magni atque repudiandae, consequatur ad deserunt beatae ratione doloremque
      inventore quis! Perferendis similique quam in delectus quia omnis minus dignissimos hic    
      consectetur adipisicing elit. Nobis, praesentium, corrupti aperiam repellat modi iure
      repellendus commodi, corporis quis inventore minima 
      eligendi hic deleniti unde exercitationem iste error dicta? Quod asperiores voluptate 
      culpa dicta perferendis tenetur magnam itaque accusamus laborum!`,
        `Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Delectus provident voluptatem aspernatur quibusdam sint soluta nostrum voluptate quas 
      amet aperiam magni atque repudiandae, consequatur ad deserunt beatae ratione doloremque    
      atque sunt. Optio vero quis natus alias totam veritatis!", "Lorem ipsum dolor sit amet
      consectetur adipisicing elit. Nobis, praesentium, corrupti aperiam repellat modi iure
      repellendus commodi, corporis quis inventore minima`
    ],
    contents: ["Section 1", "Section 2", "Section 3", "Section 4"],
    targetGroups: ["group 1", "group 2", "group 3"],
  };
  success(mockData);
  //   fetch(url, {
  //     method: "GET",
  //   })
  //     .then((response) => response.json())
  //     .then(() => success(mockData))
  //     .catch((error) => console.log(error));
};

export const getMyCourses = (userid, success) => {
  const { endpoint, ...headers } = tokens.mycourses;
  const parameters = new URLSearchParams({
    ...headers,
  });
  const url = `${endpoint}?${parameters}&userid=${userid}`;
  fetch(url, {
    method: "POST",
  })
      .then((response) => response.json())
      .then((data) => success(data))
      .catch((error) => console.log(error));
};
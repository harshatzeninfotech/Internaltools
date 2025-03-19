import axios from "axios";

// const getBaseUrl = () => {
//     const currentHostname = window.location.hostname;
//     console.log(currentHostname);
//     if (currentHostname === 'zen-infotech.org' || currentHostname === 'www.zen-infotech.org') {
//         return 'https://www.zen-infotech.org/';
//     } else {
//         return 'http://127.0.0.1:8000/';
//     }
// };

// const Api = axios.create({
//     baseURL: getBaseUrl(),
// });
const Api = axios.create({
  baseURL: "https://www.zen-infotech.org/",
});

export default Api;

const axios = require('axios');
require('dotenv').config();
const BASE_URL = 'https://api.app.outscraper.com/maps/reviews-v2'
const key = process.env.SECRET

const sleep = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
};

module.exports = (async () => {

    let query = '이지동안피부과성형외과 신논현점';
    let reviewsLimit = 5;
    let language = 'ko';
    let region = 'KR';
    let async = 'true';

    let config = {
        headers: { 'X-API-KEY': key },
        params: {
            query: query,
            reviewsLimit: reviewsLimit,
            language: language,
            region: region,
            async: async
        }
    }

    let resultAll = [];

    const response = await axios.get(BASE_URL, config);
    console.log(response.status)
    console.log(response.data.results_location, 'location!!!!!');

    await sleep(15000);

    let result = await axios.get(`${response.data.results_location}`);
    if (result.data.status.toLowerCase() == 'success') {
        console.log(result.data.status, 'status')
        // console.log(result.data.data[0].reviews_data, 'if success')
        const reviewsData = result.data.data[0].reviews_data;

        for (let review of reviewsData) {
            resultAll.push(review);
        }
    }

    if (result.data.status.toLowerCase() == 'pending') {
        await sleep(10000);
        result = await axios.get(`${response.data.results_location}`);
        console.log(result.data.status,'pending after 10s so now?')
        const reviewsData = result.data.data[0].reviews_data || result.data.data.reviews_data;

        for (let review of reviewsData) {
            resultAll.push(review);
        }

    }
    // review 갯수를 가져올 수 있는 axios 요청은, 


})();





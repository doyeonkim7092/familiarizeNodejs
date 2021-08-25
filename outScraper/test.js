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
}

module.exports = (async () => {
    let query = '김정란치과의원';
    let reviewLimit = 1;
    let language = 'ko';
    let region = 'KR'

    let config = {
        headers: { 'X-API-KEY': key },
        params: {
            query: query,
            reviewLimit: reviewLimit,
            language: language,
            region: region
        }
    }

    let response = await axios.get(BASE_URL, config);
    console.log(response.status)
    console.log(response.data.results_location, 'location!!!!!');

    await sleep(15000);

    let result = await axios.get(`${response.data.results_location}`);
    console.log(result.data.status)
    console.log(result.data, 'data 1')
    // await sleep(5000)
    // Pending Success 차이

    if (result.data.status.toLowerCase() == 'pending') {
        await sleep(5000);
        result = await axios.get(`${response.data.results_location}`);
        console.log(result.data,'if pending')
    }


    // result = await axios.get(`${response.data.results_location}`);

    // console.log(result.data, 'data 2')
    // await sleep(5000)


    // result = await axios.get(`${response.data.results_location}`);

    // let result = await axios.get('https://api.app.outscraper.com/requests/a96d786a-f2cc-438b-9d2e-271b2cd3a6f0');

    // console.log(result.data, 'data 3')
    //

})();


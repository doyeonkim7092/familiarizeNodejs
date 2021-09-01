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

let resultAll = [];
let i = 1;

async function pending({reqUrl:reqUrl, skip:skip, reviewsLimit:reviewsLimit}) {
    console.log(reqUrl, 'url')
    console.log(skip, 'skip')
    console.log(reviewsLimit, 'limit')
    let result = await axios.get(reqUrl);
        console.log(result.data.status,'im in pending');
    if (result.data.status.toLowerCase() == 'pending') {
        await sleep(5000);
        await pending({reqUrl:reqUrl, skip:skip, reviewsLimit:reviewsLimit});
    }
    else {
        const reviewsCount = result.data.data[0].reviews || result.data.data.reviews;
        const reviewsData = result.data.data[0].reviews_data || result.data.data.reviews_data;

        if (reviewsCount > 0) {
            console.log(skip, 'skip')
            console.log(`${reviewsLimit}`)
            console.log(`${reviewsCount}`)
            console.log(Math.ceil(reviewsCount / reviewsLimit))
            console.log(Boolean(skip === Math.ceil(reviewsCount / reviewsLimit)), 'same?')
            
            while (skip < Math.ceil(reviewsCount / reviewsLimit)) {
                skip++;
                for (let review of reviewsData) {
                    resultAll.push(review);
                    
                }
                console.log(resultAll, 'r')
                console.log(skip,'is plused? where pending')
                await recursion(skip);
            }
            console.log('done?')
            console.log(`${skip} is over than ${Math.ceil(reviewsCount / reviewsLimit)}`);
            makeCsv(skip);
        }
    }
}

function makeCsv(skip) {
    const fields = [
        'google_id',
        'review_id',
        'autor_link',
        'autor_name',
        'autor_id',
        'autor_image',
        'review_text',
        'review_img_url',
        'owner_answer',
        'owner_answer_time_stamp',
        'owner_answer_time_stamp_datetime_utc',
        'review_link',
        'review_rating',
        'review_timestamp',
        'review_timestamp_utc',
        'review_likes',
        'review_id'
    ];

    var replacer = function (key, value) { return value === null ? '' : value };

    let csv = resultAll.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',');
    });

    csv.unshift(fields.join(','));
    csv = csv.join('\r\n').replace(/""/gi, '0');

    let fs = require('fs');

    const now = new Date().toLocaleDateString().replace(/. /gi, '').replace('.', '_');

    fs.writeFile(`./export-default/googleSkipTest${skip}.csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}



async function recursion(skip=0) {
    
    let query = '연세봄치과의원';
    let reviewsLimit = 1;
    const language = 'ko';
    const region = 'KR';
    const async = 'true';
    console.log(skip,'start skip check')
    
    let config = {
        headers: { 'X-API-KEY': key },
        params: {
            query: query,
            reviewsLimit: reviewsLimit,
            language: language,
            region: region,
            async: async,
            skip: skip
        }
    }

    console.log(`${config.params.skip} ${i}`,'skip')

    const response = await axios.get(BASE_URL, config);
    console.log(response.data, 'hey');
    await sleep(15000);

    let result = await axios.get(`${response.data.results_location}`);

    if (result.data.status.toLowerCase() == 'success') {
        console.log(result.data.status, 'status')
        // console.log(result.data,'s data')
        const reviewsCount = result.data.data[0].reviews || result.data.data.reviews;
        const reviewsData = result.data.data[0].reviews_data || result.data.data.reviews_data;

        if (reviewsCount > 0) {
            console.log(skip,'skip')
            console.log(`${reviewsLimit}`)
            console.log(`${reviewsCount}`)
            console.log(Math.ceil(reviewsCount / reviewsLimit))
            console.log(Boolean(skip = Math.ceil(reviewsCount / reviewsLimit)),'same?')
            while (skip < Math.ceil(reviewsCount / reviewsLimit)) {
                skip++;
                for (let review of reviewsData) {
                    resultAll.push(review);
                }
                console.log(resultAll, 'r')
                console.log(skip,'is plused? where recursion success')
                await recursion(skip);
            }
            console.log('done?')
            console.log(`${skip} is over than ${Math.ceil(reviewsCount / reviewsLimit)}`);
            makeCsv(skip);
        }
    } else {
        await sleep(5000);
        await pending({ reqUrl: reqUrl, skip: skip, reviewsLimit: reviewsLimit })
        // await sleep(15000);
        // console.log('else sleep 15s............')
        // let reqUrl = response.data.results_location;
        // if (result.data.status.toLowerCase() == 'pending') {
        //     await pending({ reqUrl: reqUrl, skip: skip, reviewsLimit: reviewsLimit })
        // };

        // result = await axios.get(`${response.data.results_location}`);
        // console.log(result.data.status, 'status')
        // // console.log(result.data,'p data')
        // const reviewsCount = result.data.data[0].reviews || result.data.data.reviews;
        // const reviewsData = result.data.data[0].reviews_data || result.data.data.reviews_data;

        // if (reviewsCount > 0) {
        //     console.log(skip,'skip')
        //     console.log(`${reviewsLimit}`)
        //     console.log(`${reviewsCount}`)
        //     console.log(Math.ceil(reviewsCount / reviewsLimit))
        //     console.log(Boolean(skip === Math.ceil(reviewsCount / reviewsLimit)),'same?')
        //     while (skip < Math.ceil(reviewsCount / reviewsLimit)) {
        //         skip++;
        //         for (let review of reviewsData) {
        //             resultAll.push(review);
                    
        //         }
        //         console.log(resultAll, 'r')
        //         console.log(skip,'is plused? where recursion pending')
        //         await recursion(skip);
        //     }
        //     console.log('done?')
        //     console.log(`${skip} is over than ${Math.ceil(reviewsCount / reviewsLimit)}`);
        //     makeCsv(skip);
        }
    }    
// }

recursion();
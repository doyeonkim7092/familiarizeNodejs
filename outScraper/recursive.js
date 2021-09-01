const axios = require('axios');
const BASE_URL = 'https://api.app.outscraper.com/maps/reviews-v2'
require('dotenv').config();
const key = process.env.SECRET

const sleep = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

// 요청결과가 pending인 경우 5초마다 하는 함수

// 페이지네이션 재귀 for문으로 명확하게

/*
1. 기본 요청 함수 만들고, 여기서 페이지네이션 재귀를 만든다
2. 두번째 요청에서 펜딩일 경우 5초마다 반복하는 함수를 만든다
3. 
*/

const allReviews = [];

async function reqAgain(reqUrl) {
    await sleep(5000);
    console.log('######slept######')
    const result = await axios.get(reqUrl);
    let reviewData;

    if (result.data.status.toLowerCase() == 'success') {
        reviewData = result.data.data[0];
        return reviewData;
    }
    else {
        return await reqAgain(reqUrl);
    }
}

function makeCsv() {
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

    let csv = allReviews.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',');
    });

    csv.unshift(fields.join(','));
    csv = csv.join('\r\n').replace(/""/gi, '0');

    let fs = require('fs');

    const now = new Date().toLocaleDateString().replace(/. /gi, '').replace('.', '_');

    fs.writeFile(`./export-default/googleReview.csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}

(async function apicall(skip=0) {
    console.log(skip,'skip')
    let query = '연세봄치과의원';
    let reviewsLimit = 1;
    const language = 'ko';
    const region = 'KR';
    const async = 'true';

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

    const response = await axios.get(BASE_URL, config);
    
    const reqUrl = response.data.results_location;

    console.log('started')
    const result = await reqAgain(reqUrl);
    console.log(result, 'result')
    
    //result.reviews === 리뷰갯수 
    //리뷰갯수를 스킵으로 
    if (result.reviews > 0) {
        // tried for loop (1st try)
        // for (skip; skip= Math.ceil(result.reviews/reviewsLimit); skip++){
        //     console.log(skip,'in for loop')
        //     console.log(Math.ceil(result.reviews/reviewsLimit))
        //     for (let review of result.reviews_data) {
        //         allReviews.push(review);
        //         console.log(allReviews, 'pushed?')
                
        //     }
        //     console.log(skip);
        //     
        // }

        do {
            console.log(skip,'hey')
            skip++;
            for (let review of result.reviews_data) {
                allReviews.push(review);
            }
            console.log(allReviews, 'is pushed?')
            return await apicall(skip);
        } while (skip == Math.ceil(result.reviews / reviewsLimit));


    }else {
        //리뷰갯수가 없는 경우에 대한 핸들링
    }

    makeCsv();

})();










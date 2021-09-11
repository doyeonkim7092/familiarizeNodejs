const { getMysqlConnection } = require('@localink/utils');
const axios = require('axios');
const BASE_URL = `https://place.map.kakao.com/m/commentlist/v/`;

const sleep = function (time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

const getKakaoReviews = async (kakaoId, next = 1) => {

    await sleep(2000);
    const response = await axios.get(`${BASE_URL}${kakaoId}/${next}`);

    return response;
}

const main = async () => {
    let next = 1;
    // const conn = await getMysqlConnection({ stage: 'development', project: 'localink_hospital' });

    let [ hospitals ] = await conn.query(`
        SELECT
            id, kakao_place_id
        FROM
            hospitals_kakao
        WHERE
            kakao_place_id IS NOT NULL
            AND removed_at IS NULL
    `);

    const columns = [
        'hospital_id',
        'place_id',
        'unique_id', 'type',
        'source', 'writer',
        'writer_image_url',
        'contents',
        'contents_image_url',
        'reply',
        'reply_created_at',
        'score',
        'visit_count',
        'created_at'
    ];

    // hospitals = hospitals.slice(0, 100);

    for (let hospital of hospitals) {

        console.log(`hospital is ${hospital.kakao_place_id}`)

        let kakaoId = hospital.kakao_place_id;
        const reviewPerPage = 10;

        do {
            const response = await getKakaoReviews(kakaoId, next);
            let totalPage = Math.ceil(response.data.comment.kamapComntcnt / reviewPerPage)

            if (response.data.comment.list) {
                for (let review of response.data.comment.list) {

                    const eachReviewData = [];

                    eachReviewData.push(
                        conn.escape(hospital.id),
                        conn.escape(hospital.kakao_place_id),
                        conn.escape(review.commentid),
                        conn.escape(null),
                        conn.escape('KAKAO'),
                        conn.escape(review.username),
                        conn.escape(review.profile !== '' ? review.profile : null),
                        conn.escape(review.contents),
                        conn.escape(review.thumbnail ? review.thumbnail : null),
                        conn.escape(null),
                        conn.escape(null),
                        conn.escape(review.point),
                        0,
                        conn.escape(review.date)
                    );

                    await conn.query(`
                    INSERT INTO
                        hospital_crawling_reviews_copied (${columns.join(',')})
                    VALUES
                        (${eachReviewData.join(',')})
                    `);
                }
            }
            else if(!response.data.comment.list){
                console.log(`${hospital.kakao_place_id} has no reviews`);
                break;
            }
            if (next === totalPage) {
                break;
            } else {
                next++;
            }

        } while (true);

        next = 1;
    }
    console.log('END')

}

main();
const axios = require('axios');
const BASE_URL = 'https://api.place.naver.com/graphql';

const resultAll = [];

let i = 0;

const sleep = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

const makeCsv = (naverPlaceId) => {
    const fields = [
        'unique_id',
        'type',
        'source',
        'writer',
        'writer_image_url',
        'contents',
        'contents_image_url',
        'reply',
        'reply_created_at',
        'score',
        'visit_count'
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

    fs.writeFile(`./export-default/${naverPlaceId}_reviews.csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}

(async function getReviews(page =1){
    i++;
    console.log(`firstPage is ${page}`);
    await sleep(1000);
    const naverPlaceId = "36912429";

    const pagePerDisplay = 100;

    const response = await axios.post(BASE_URL,{

        query : `query getVisitorReviews($input: VisitorReviewsInput) {
            visitorReviews(input: $input) {
                items {
                    id
                    rating
                    author {
                        id
                        nickname
                        from
                        imageUrl
                        objectId
                        url
                        review {
                            totalCount
                            imageCount
                            avgRating
                            __typename
                        }
                        __typename
                    }
                    body
                    thumbnail
                    media {
                        type
                        thumbnail
                        __typename
                    }
                    tags
                    status
                    visitCount
                    viewCount
                    visited
                    created
                    reply {
                        editUrl
                        body
                        editedBy
                        created
                        replyTitle
                        __typename
                    }
                    originType
                    item {
                        name
                        code
                        options
                        __typename
                    }
                    language
                    highlightOffsets
                    translatedText
                    businessName
                    showBookingItemName
                    showBookingItemOptions
                    bookingItemName
                    bookingItemOptions
                    __typename
                    }
                    starDistribution {
                        score
                        count
                        __typename
                    }
                    hideProductSelectBox
                    total
                    __typename
                }
            }`,
        variables:{
            input: {
                "businessId": naverPlaceId,
                "businessType": "hospital",
                "item": "0",
                "page": page,
                "display": 100,
                "isPhotoUsed": false,
                "theme": "allTypes",
                "includeContent": true,
                "getAuthorInfo": true
            }
        }
    },{
        headers: {
            'Content-Type': 'application/json'
        }
    });

    //분기를 나눈다 100개 미만 or Not

    const totalReviewsCount = response.data.data.visitorReviews.total;

    let list = response.data.data.visitorReviews.items;

    if(totalReviewsCount > 100 && page < Math.ceil( totalReviewsCount / 100 )){
        do {
            page++;
            for(let review of list){
                // console.log(Array.isArray(review))
                // console.log(review)
                review = [review].map(row => ({
                    unique_id: row.id,
                    type: row.originType == '예약' ? 'BOOKER' : 'RECEIPT',
                    source: row.author.from,
                    writer: row.author.nickname,
                    writer_image_url: row.author.imageUrl,
                    contents: row.body,
                    contents_image_url: row.thumbnail,
                    reply: row.reply.body ? row.body.reply : null,
                    reply_created_at: row.reply.body ? row.reply.created : null,
                    score: row.rating,
                    visit_count: row.visitCount
                }));

                review = review[0];

                resultAll.push(review);
            }
            return await getReviews(page);
        } while (page == Math.ceil( totalReviewsCount / 100 ));
    }
    else{
        for(let review of list){

            review = [review].map(row => ({
                unique_id: row.id,
                type: row.originType == '예약' ? 'BOOKER' : 'RECEIPT',
                source: row.author.from,
                writer: row.author.nickname,
                writer_image_url: row.author.imageUrl,
                contents: row.body,
                contents_image_url: row.thumbnail,
                reply: row.reply.body ? row.body.reply : null,
                reply_created_at: row.reply.body ? row.reply.created : null,
                score: row.rating,
                visit_count: row.visitCount
            }));

            review = review[0];

            console.log(review,'1111')

            resultAll.push(review);
        }
    }

    makeCsv(naverPlaceId);

    console.log(resultAll,'which shape')
})();


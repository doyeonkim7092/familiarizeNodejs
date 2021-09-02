const axios = require('axios');

const BASE_URL = `https://place.map.kakao.com/m/commentlist/v/`;

const resultAll = [];

let i = 1;

function makeCsv(kakaoId) {
    const fields = [
        'commentid',
        'contents',
        'point',
        'username',
        'profile',
        'profileStatus',
        'photoCnt',
        'likeCnt',
        'kakaoMapUserId',
        'data',
        'isMy',
        'isEditable',
        'isMyLike'
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

    fs.writeFile(`./export-default/${kakaoId}_reviews.csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}


(async function main(next = 1){
    console.log(i,'i')
    const kakaoId = `19706829`;

    const reviewPerPage = 10;

    let response = await axios.get(`${BASE_URL}${kakaoId}/${next}`);

    if(response.data.comment.nextPage){
        next++;
        do{
            for(let review of response.data.comment.list){
                resultAll.push(review);
            }
            console.log(next,'next1111')
            return await main(next);
        }while(next == Math.ceil(response.data.comment.kamapComntcnt / reviewPerPage));
    }
    else{
        for(let review of response.data.comment.list){
            resultAll.push(review);
        }
    }

    makeCsv(kakaoId);

})();

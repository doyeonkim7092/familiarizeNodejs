/*
* kakao API 검색 시, 해야 할 유의사항
* 포스트맨 키워드 검색 카테고리 SW8 **호선 **역  으로 검색 ex - 2호선 강남역  // 신분당선 강남역
*
* */
const axios = require('axios');
let subwayInfo = require('./subway.json');
const BASE_URL = `https://dapi.kakao.com/v2/local/search/keyword.json?`;
require('dotenv').config();

const resultAll = [];
const undefResult = [];

const sleep = function(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
};

const makeCsv = () => {
    const fields = [
        'id',
        'line',
        'name',
        'lat',
        'lng',
        'kakao_place_id',
        'kakao_place_name',
        'kakao_address',
        'kakao_road_address',
        'kakao_phone',
        'kakao_place_url',
        'kakao_lat',
        'kakao_lng',
        'kakao_category_group_code',
        'kakao_category_group_name',
        'kakao_category_name'
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

    fs.writeFile(`./export-default/kakaoStationInfo(400~end).csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}
let i = 0;
const getKakaoSubwayInfo = async () => {

    subwayInfo = subwayInfo.slice(400,subwayInfo.length-1);

    for(let subway of subwayInfo){
        console.log(`${i++}/${subwayInfo.length}`)
        let subwayLine = subway.line.split(0).join('') == '수인선' ? '수인분당선' : (subway.line.split(0).join('') == '인천선' ? '인천1호선' : subway.line.split(0).join(''));
        let subwayName = subway.name == '국수' ? '국수역' : (subway.name == '달미' ? '달미역' : subway.name);
        console.log(`${subwayLine} ${subwayName}`, 'search Query');
        const config = {
            headers : {'Authorization' : process.env.KEY },
            params : {
                category_group_code : 'SW8',
                query : `${subwayLine} ${subwayName}`,
            }
        }
        await sleep(2000);
        const response = await axios.get(BASE_URL, config);
        console.log(response.data.documents[0],'will push data');
        if(response.data.documents){
            // resultAll.push(response.data.documents[0]);
            resultAll.push({
                id: subway.id,
                line: subway.line,
                name: subway.name,
                lat: subway.latitude,
                lng: subway.longitude,
                kakao_place_id: response.data.documents[0].id,
                kakao_place_name: response.data.documents[0].place_name,
                kakao_address: response.data.documents[0].address_name,
                kakao_road_address: response.data.documents[0].road_address_name,
                kakao_phone: response.data.documents[0].phone,
                kakao_place_url: response.data.documents[0].place_url,
                kakao_lat: response.data.documents[0].x,
                kakao_lng: response.data.documents[0].y,
                kakao_category_group_code: response.data.documents[0].category_group_code,
                kakao_category_group_name: response.data.documents[0].category_group_name,
                kakao_category_name: response.data.documents[0].category_name
            });
        }
        else{
            console.log(response.data);
            undefResult.push(config.params.query);
        }
    }

    makeCsv();
};

getKakaoSubwayInfo()
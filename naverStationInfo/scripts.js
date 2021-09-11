/*
* naver API 검색 시, 해야 할 유의사항
* 포스트맨 1depth 네이버 검색 기준 으로 **호선 **역  으로 검색 ex - 2호선 강남역  // 신분당선 강남역
* */

const axios = require('axios');
const BASE_URL = `https://m.map.naver.com/external/SubwayProvide.xml?`
const resultArr = [];

const makeCsv = () => {
    const fields = [
       'id',
        'logicalLine_code',
        'logiclLine_name',
        'longitude',
        'latitude',
        'name',
        'koName',
        'enName',
        'displayCode'
    ];

    var replacer = function (key, value) { return value === null ? '' : value };

    let csv = resultArr.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',');
    });

    csv.unshift(fields.join(','));
    csv = csv.join('\r\n').replace(/""/gi, '0');

    let fs = require('fs');

    const now = new Date().toLocaleDateString().replace(/. /gi, '').replace('.', '_');

    fs.writeFile(`./export-default/naverSubwayInfo.csv`, csv, function (err) {
        if (err) throw err;
        console.log(`EXPORT Success`);
    })
    console.log(new Date(), 'DONE');
    return;
}

const getstationInfo = async () => {

    const config = {
        params : {
            requestFile: `metaData.json`,
            readPath: 1000, //수도권
            version: 6.25
        }
    };

    const response = await axios.get(BASE_URL, config);

    // console.log(response.data[0].realInfo[0]);
    for(let station of response.data[0].realInfo){
        resultArr.push({
            id: station.id,
            logicalLine_code : station.logicalLine.code,
            logiclLine_name : station.logicalLine.name,
            longitude : station.longitude,
            latitude : station.latitude,
            name: station.name,
            koName: station.koName,
            enName: station.enName,
            displayCode: station.displayCode
        });
    }

    makeCsv();

}

getstationInfo();

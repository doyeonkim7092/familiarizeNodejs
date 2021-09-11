/*
* 구글 은 카테고리를 subway_station
* 역명으로 검색해도 될것으로 판단
* */

const axios = require('axios');
const BASE_URL = `https://maps.googleapis.com/maps/api/place/textsearch/json?`;
let subwayInfo = require('./subway.json');
require('dotenv').config();
const resultAll = [];

const sleep = function(time){
    return new Promise((resolve) => {
        setTimeout(()=>{
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
        'google_place_id',
        'google_place_name',
        'google_address',
        'google_lat',
        'google_lng'
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

    fs.writeFile(`./export-default/googleStationInfoTotal.csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}
let i = 0;
const getGoogleSubwayInfo = async () => {

    subwayInfo = subwayInfo.slice(646, subwayInfo.length-1);

    for(subway of subwayInfo){
        console.log(`${i++}/${subwayInfo.length}`)
        await sleep(10000);
        let subwayLine = subway.line.split(0).join('');
        let subwayName = subway.name;
        const config = {
            params:{
                input: `${subwayLine} ${subwayName}역`,
                inputtype: 'textquery',
                fields: 'formatted_address',
                key: process.env.SECRET,
                language: 'ko',
                region: 'kr',
                type: 'subway_station'
            }
        };

        const response = await axios.get(BASE_URL,config);
        if(response.data.results.length >= 1){
            resultAll.push({
                id: subway.id,
                line: subway.line,
                name: subway.name,
                lat: subway.latitude,
                lng: subway.longitude,
                google_place_id: response.data.results[0].place_id,
                google_place_name: response.data.results[0].name,
                google_address: response.data.results[0].formatted_address,
                google_lat: response.data.results[0].geometry.location.lat,
                google_lng: response.data.results[0].geometry.location.lng,
            });
            makeCsv();
            continue;
        }
        else{
            console.log(response.data.status, subway.id);
            resultAll.push({
                id: subway.id,
                id: subway.id,
                line: subway.line,
                name: subway.name,
                lat: subway.latitude,
                lng: subway.longitude,
                google_place_id: response.data.status
            })
            makeCsv();
            continue;
        }
    }
    // makeCsv();
}

getGoogleSubwayInfo();

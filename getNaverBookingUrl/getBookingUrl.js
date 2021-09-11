const BASE_URL = `https://map.naver.com/v5/api/sites/summary`;
const { getMysqlConnection } = require('@localink/utils');

const axios = require('axios');

const sleep = function (time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

const falsyHospialList = [];

const makeCsv = () => {
    const fields = [
        'id',
        'result'
    ];

    var replacer = function (key, value) { return value === null ? '' : value };

    let csv = falsyHospialList.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',');
    });

    csv.unshift(fields.join(','));
    csv = csv.join('\r\n').replace(/""/gi, '0');

    let fs = require('fs');

    const now = new Date().toLocaleDateString().replace(/. /gi, '').replace('.', '_');

    fs.writeFile(`./export-default/falsyBookingUrl(20000~end).csv`, csv, function (err) {
        if (err) throw err;
        console.log('1', `EXPORT Success : DONEDONE`);
    })

    console.log(new Date(), 'DONE');
    return;
}

const getBookingUrl = async () => {

    let conn = await getMysqlConnection({ stage: 'development', project: 'localink_hospital' });

    let [naverPlaceId] = await conn.query(`
        select 
            hospital_records_copy.id,
            hospital_records_copy.hospital_id,
            hospitals.naver_place_id 
        from 
            hospital_records_copy 
        join hospitals
            on hospitals.id = hospital_records_copy.hospital_id and hospitals.naver_place_id is not null
        where hospital_records_copy.removed_at is null
    `);

    naverPlaceId = naverPlaceId.slice(22000, naverPlaceId.length-1);

    let i = 1;
    for (let id of naverPlaceId) {

        try {

            if (i % 100 === 0) {
                await sleep(1000 * 60);
            } else {
                await sleep(500);
            }
            const response = await axios.get(`${BASE_URL}/${id.naver_place_id}`);
            console.log(response.data.hasNaverBooking)
            if (response.data.hasNaverBooking == true) {
                await conn.query(`
                    UPDATE
                        hospital_records_copy
                    SET
                        naver_place_id = ${id.naver_place_id},
                        naver_booking_url= '${response.data.naverBookingUrl}'
                    WHERE
                        hospital_records_copy.hospital_id = ${id.hospital_id}
                `)
            }
            else if (response.data.hasNaverBooking == false) {
                falsyHospialList.push({
                    id: id.id,
                    result: response.data.hasNaverBooking
                });
            }
            else {
                falsyHospialList.push({
                    id: id.id,
                    result: response.data.hasNaverBooking
                })
            }
            await conn.commit();
        }
        catch (e) {
            console.log(e);
            await conn.rollback();
        }
        console.log(`${i++}/${naverPlaceId.length}`);
    }

    makeCsv();
}

getBookingUrl();
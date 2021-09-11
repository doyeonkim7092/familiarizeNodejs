const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://place.map.kakao.com/'

let place_id = 20026594

async function getHTML(kakoPlaceId) {
    try {
        return await axios.get(`${BASE_URL}${kakoPlaceId}`);
    } catch (e) {
        console.log(e);
    }
}

async function parsing(kakoPlaceId) {
    const html = await getHTML(kakoPlaceId);
    // console.log(html,'html')
    const $ = cheerio.load(html.data);

    console.log($('.kakaoBody').find().text(),'4')

    //1 하나의 태그에 있는 text 를 가져오기


    //2 하나의 태그 내에 있는 태그들의 text를 배열에 담아 하나의 묶음으로 출력하기



    
}

parsing(place_id);

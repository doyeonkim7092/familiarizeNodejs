const cheerio = require('cheerio');
const axios = require('axios');

// part 1
// async function getData() {
//     const response = await axios.get(`https://place.map.kakao.com/20026594`);

//     console.log(response.data.trim())
//     console.log(response)
// }

// getData()

async function getData() {
    const response = await axios.get(`https://place.map.kakao.com/20026594`).then(urlResponse => {
        const $ = cheerio.load(urlResponse.data);

        $('div.basicInfo').each((index, element) => {
            const title = $(element).find('h2.tit_location').text();
            console.log(title,'t')
        })
        
    })
    console.log(response,'r')
}

getData()
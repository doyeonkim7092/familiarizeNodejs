import json
from outscraper import ApiClient

api_client = ApiClient(api_key='')
businss_with_reviews = api_client.google_maps_business_reviews(
    'https://www.google.co.kr/maps/place/%EC%97%B0%EC%84%B8%EA%B5%BF%EB%8D%B0%EC%9D%B4%EC%B9%98%EA%B3%BC/@37.4830683,127.0338198,17z/data=!3m1!4b1!4m5!3m4!1s0x357ca14bce39aacb:0x8ff9ddb0dea61e9!8m2!3d37.4830683!4d127.0360138',
    limit=100,
    language='ko'
)

with open('reviews.json','w') as file:
    json.dump(businss_with_reviews, file, indent=4)
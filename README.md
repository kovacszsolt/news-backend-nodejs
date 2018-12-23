# ITCrowd NodeJS Server side
NodeJS twitter aggregator
Store Twitter tweets in Mongo Database

## Configuration
  [Example config](config.example.json)

## Usage
- node ./read/read_0_purge.js  
- node ./read/read_1_twitter.js  
- node ./read/read_2_meta.js  
- node ./read/read_3_image.js  
- node ./read/read_4_resize.js  
- node ./read/read_5_finish.js  

- node ./web.js
  Web Service


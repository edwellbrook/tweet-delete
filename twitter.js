const Twitter = require('twitter')
const _ = require('./rate_limit')

// load config from `.env` file
require('dotenv').config()

const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_KEY,
    access_token_secret: process.env.ACCESS_SECRET
})

module.exports = _.rateLimit((tweet) => {
    if (tweet.retweeted_status) {
        client.post(`statuses/unretweet/${tweet.id}.json`, (error, response) => {
            if (error != null) { return console.error(error[0].message) }
            console.log('unretweeted:', tweet.text)
        })
    } else {
        client.post(`statuses/destroy/${tweet.id}.json`, (error, response) => {
            if (error != null) { return console.error(error[0].message) }
            console.log('deleted:', tweet.text)
        })
    }
}, 1000)

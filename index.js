// these should be configurable
const directory = ''
const yearFilter = '2012'

// load config from `.env` file
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const _ = require('./rate_limit')
const Twitter = require('twitter')

const client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_KEY,
    access_token_secret: process.env.ACCESS_SECRET
})

// this is where tweets get loaded into
Grailbird = { data: {} }

// throttle requests to 1 per second
const throttledDelete = _.rateLimit((tweet) => {
    if (tweet.retweeted_status) {
        return client.post(`statuses/unretweet/${tweet.id}.json`, (error, response) => {
            console.log('unretweeted:', tweet.text)
        })
    } else {
        client.post(`statuses/destroy/${tweet.id}.json`, (error, response) => {
            console.log('deleted:', tweet.text)
        })
    }
}, 1000)

fs.readdir(directory, (err, files) => {
    if (err != null) {
        throw err
    }

    files.forEach((filename) => {
        if (filename.indexOf('.js') === -1) {
            return
        }

        const filepath = path.resolve(directory, filename)
        require(filepath)
    })

    const months = Object.keys(Grailbird.data)
    
    months.forEach((month) => {
        if (month.indexOf(`tweets_${yearFilter}`) !== 0) {
            return
        }

        const tweets = Grailbird.data[month]
        tweets.forEach(throttledDelete)
    })
})

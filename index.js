const fs = require('fs')
const path = require('path')
const program = require('commander')
const tweetDelete = require('./twitter')

program
    .usage('<path to tweet data> [options]')
    .option('--year <year>', 'year to delete')
    .option('--month <month>', 'month to delete')
    .parse(process.argv)

if (program.args[0] == null) {
    throw new Error('Tweet directory must be specified')
}

if (program.year == null || typeof program.year !== 'string') {
    throw new Error('Year must be specified for deletion')
}


// this is where tweets get loaded into
Grailbird = { data: {} }

const directory = program.args[0]
fs.readdir(directory, (err, files) => {
    if (err != null) {
        throw err
    }

    let filter = program.year
    if (program.month != null && typeof program.month === 'string') {
        filter += `_${program.month}`
    }

    files.forEach((filename) => {
        if (filename.indexOf(filter) === -1) {
            return
        }

        const filepath = path.resolve(directory, filename)
        require(filepath)
    })

    const months = Object.keys(Grailbird.data)
    months.forEach((month) => {
        const tweets = Grailbird.data[month]
        tweets.forEach(tweetDelete)
    })
})

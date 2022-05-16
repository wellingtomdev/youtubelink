// import youtubeLink from './index.js';
const youtubeLink = require('./index.js')

const iconCheck = '\x1b[32m✔\x1b[0m'
const iconError = '\x1b[31m✘\x1b[0m'
const tabulation = '    '
const ln = '\n'

function describe(name, fn) {
    console.log(`${ln}\x1b[1m${name}:\x1b[0m`)
    fn()
}

function error(message) {
    console.log(iconError, message)
}

function passed(message) {
    console.log(`${tabulation}${iconCheck}  ${message}`)
}

function expect(name, value, expected) {
    if (value == expected) {
        passed(`${name}`)
        return false
    }
    throw new Error(`${tabulation}${tabulation}${name} is not correct${ln}${ln}${tabulation}Expected: ${expected}${ln}${tabulation}Received: ${value}`)
}

console.clear()

try {

    describe('youtubeLink', () => {

        {
            const result = youtubeLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            expect('videoId', result.videoId, 'dQw4w9WgXcQ')

        }
        {
            const result = youtubeLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&index=1')
            expect('videoId with list and index param', result.videoId, 'dQw4w9WgXcQ')
            expect('list param', result.list, 'RDdQw4w9WgXcQ')
            expect('index param', result.index, '1')
        }

    })

    describe('link formats', () => {
        {
            const result = youtubeLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
            expect('link www.youtube.com', result.videoId, 'dQw4w9WgXcQ')
        }
        {
            const result = youtubeLink('https://youtube.com/watch?v=dQw4w9WgXcQ')
            expect('link youtube.com', result.videoId, 'dQw4w9WgXcQ')
        }
        {
            const result = youtubeLink('https://www.youtu.be/dQw4w9WgXcQ')
            expect('link www.youtu.be', result.videoId, 'dQw4w9WgXcQ')
        }
        {
            const result = youtubeLink('https://youtu.be/dQw4w9WgXcQ')
            expect('link youtu.be', result.videoId, 'dQw4w9WgXcQ')
        }
    })


} catch (err) {

    error(err.message)
    console.log(`${ln}${ln}`)
    console.error(err)
    console.log(`${ln}${ln}`)

}



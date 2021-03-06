const express = require('express')
const router = express.Router()
const axios = require('axios')
const request = require('request')
const fs = require('fs')

let dates;
fs.readFile('./dates.txt', (err, data) => {
    if (err) {
        console.log(err)
        return
    }
    dates = data.toString().split('\n').map(date => {
        let dateObj = new Date(date.replace(/[^\x20-\x7E]/g, ''))
        let parsedDate = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`
        return parsedDate
    })
})

const API_KEY = '//ADD API KEY HERE'
const API = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?api_key=${API_KEY}`
const BASE_URL = "http://mars.jpl.nasa.gov/"

const download = (url, callback) => {
    let lastSlash = url.lastIndexOf("/")
    let filename = url.substring(lastSlash + 1)
    let dir = url.substring(BASE_URL.length).replace(filename, '')
    request.head(url,  (err, res, body) => {
        fs.mkdirSync(dir, { recursive: true });
        request(url).pipe(fs.createWriteStream(dir + filename)).on('close', callback)
    })
}

router.get('/', (req, res) => {
    let promises = dates.map(date => {
        return new Promise((resolve, reject) => {
            resolve(
                axios.get(`${API}&earth_date=${date}`).then(images => {
                    let img_src = images.data.photos.map(img => img.img_src);

                    img_src.forEach(img => {
                        download(img, () => {
                            console.log('Downloaded ' + img)
                        })
                    })

                    let posts = {}

                    posts.date = date
                    posts.images = img_src

                    return posts
                })
            )
        })
    })

    Promise.all(promises).then(posts => {
        res.send(posts)
    }).catch(error => {
        console.error(error.message)
    })
})




// router.get('/', (req,res)=>{
//     axios.get(`${PostAPI}/posts`).then(posts=>{
//         res.status(200).json(posts.data)
//     })
//     .catch(error=>{
//         res.status(500).send(error)
//     })
// })



module.exports = router

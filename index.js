const axios = require('axios')
const wallpaper = require('wallpaper')
const fs = require('fs')
const stream = require('stream')
const util = require('util')

const finished = util.promisify(stream.finished);

async function downloadImage(fileUrl, outputLocationPath) {
    const writer = fs.createWriteStream(outputLocationPath);
    return axios({
        method: 'get',
        url: fileUrl,
        responseType: 'stream',
    }).then(async response => {
        response.data.pipe(writer);
        return finished(writer); //this is a Promise
    });
}

axios.get('https://go.microsoft.com/fwlink/?linkid=2151983&screenWidth=2880&screenHeight=1800&env=live')
    .then(res => {
        const img = res.data.images[0]
        const fileNameEle = img.url.split('/')
        const fileName = fileNameEle[fileNameEle.length - 1]
        downloadImage(img.urlbase, `images/${fileName}`)
            .then(() => {
                wallpaper.set(`images/${fileName}`).then(() => console.log('Wallpaper changed!'))
            })
        // res.data.images.forEach(img => {
        //     const fileNameEle = img.url.split('/')
        //     const fileName = fileNameEle[fileNameEle.length - 1]
        //     downloadImage(img.urlbase, `images/${fileName}`)
        // })
    })

const express = require('express')
const path = require('path')
const fs = require('fs')
const url = require('url')

const app = express()

app.use('/', (req, res) => {
  const { pathname } = url.parse(req.url)
  if (pathname === '/') {
    const html = fs.readFileSync(path.resolve(__dirname, './public/index.html'))
    res.end(html)
  } else if (pathname === '/1.jpeg') {
    const img = fs.readFileSync('./public/1.jpeg')
    // 强缓存  expires
    // res.set('Expires', new Date('2024-07-10 11:39:00').toUTCString())
    // 强缓存 cache-control 
    res.set('Cache-Control', 'no-cache')
    res.set('')
    res.end(img)
  } else if (pathname === '/2.jpg') {
    // const ifModifiedSince = req.headers['if-modified-since']
    // const { mtime } = fs.statSync('./public/2.jpg')
    // 判断文件更新时间是否一样
    // if (ifModifiedSince === mtime.toUTCString()) {
    //   res.statusCode = 304
    //   res.end()
    //   return
    // }
    // const img = fs.readFileSync('./public/2.jpg')
    // res.set('Cache-Control', 'no-cache')
    // res.set('last-modified', mtime.toUTCString())
    // res.end(img)
    const ifNoneMatch = req.headers['if-none-match']
    const img = fs.readFileSync('./public/2.jpg')
    const hash = etag(img)
    // 判断文件是否更新
    if (ifNoneMatch === hash) {
      res.statusCode = 304
      res.end()
      return
    }
    res.set('Cache-Control', 'no-cache')
    res.set('Etag', hash)
    res.end(img)
  } else {
    res.end('404')
  }
})

app.listen(5000, () => {
  console.log('server is running on port 5000')
})

const express = require('express')
const postsRouter = require('./posts-router')
const server = express()
const port = 7000

server.use(express.json())

server.use('/', postsRouter)

server.listen(port, () => {
    console.log(`\n *** Server is listening on port ${port} *** \n`)
})

server.get('/', (req, res) => {
    res.send("<h1>hello</h1>")
})
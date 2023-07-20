const express = require('express')
const router = express.Router()
const getAccessToken = require('../spotify-api/spotify-api')

//
router.get('/', async (req, res) => {
    const data =  await getAccessToken()

    res.json(data)

})

module.exports = router

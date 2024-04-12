const express = require('express');
const {handleGenerateNewShortUrl, handleGetAnaytics} = require('../controllers/url')
const router = express.Router();
router.post('/', handleGenerateNewShortUrl)
router.get('/analytics/:shortId', handleGetAnaytics)
module.exports = router;
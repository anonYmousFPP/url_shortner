const shortid = require('shortid');     //it create a random short id of 8 characters
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res){
    console.log('Reach before the body');
    const body = req.body;
    console.log('Reach after the body');
    if(!body.url) return res.status(400).json({error: 'URL is required'})
    const shortID = shortid();
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitedHistory: [],
        createdBy: req.user._id,
    });
    
    return res.render('home', {
        id: shortID,
    })
}

async function handleGetAnaytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    console.log('results are', result);
    return res.json({
        totalClicks:result.visitHistry.length,
        analytics: result.visitHistry,
    })
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnaytics,
}
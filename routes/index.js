const express =  require('express');
const router = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');
var ejs = require('ejs');

// Setting express engine
router.set('view engine', 'ejs');
router.use(express.static("public"));

// Home page
router.get('/', async(req,res) =>{
    res.render("../views/home");
});


router.post('/shorten', async (req, res) => {
    
    const {longurl} = req.body;

    const baseurl = req.headers.host;

    if(!validUrl.isUri(baseurl))
    {
        res.send("Invalid base url");
    }

    if(!validUrl.isUri(longurl))
    {
        res.send("Invalid long url");
    }

    const code = shortid.generate();
    
    const shorturl = baseurl + '/' + code;

    
    res.render('../views/url', {
        'shorturl' : shorturl
    });
});
  
router.get('/:code', async(req,res) => {
    const url = await Url.findOne({'code': req.params.code});

    if(url)
    {
        res.send(url);
    }

    else
    {
        res.send("URL not found");
    }
});

module.exports = router;
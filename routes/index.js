const express =  require('express');
const router = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');
var ejs = require('ejs');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json({type: 'application/json'}));


// Home page
router.get('/', async(req,res) =>{
    res.render("../views/home");
});

// Creating a new short url
router.post('/shorten', async (req, res) => {
    
    const {longurl} = req.body;

    const baseurl = req.headers.host;

    // checking validity of base url
    if(!validUrl.isUri(baseurl))
    {
        res.send("Invalid base url");
    }

    // checking validity of long url
    if(!validUrl.isUri(longurl))
    {
        res.send("Invalid long url");
    }

    // Check if the long url already exists in the database
    const oldurl = await Url.findOne({'longurl': longurl});

        if(oldurl)
        {

            res.render('../views/url', {
                'url' : oldurl
            });
        }

    else
    {

    // Generate unique short id
    const code = shortid.generate();

    // Short URL
    const shorturl = baseurl + '/' + code;

    try{

        const newUrl = new Url({
            longurl: longurl,
            code: code,
            shorturl: shorturl,
            date: new Date()       
        });
        
        
        const newurl2 = await newUrl.save();
        console.log(newurl2);
       
     res.render('../views/url', {
          'url' : newurl2
    });    
    }catch(err)
    {
        console.log(err);
    }

    }
});
  
router.post('/custom/:code', async(req,res) => {

    const {custom} = req.body;
    const url = await Url.findOne({'code': req.params.code});

    var newvalues = { $set: {code: custom, shorturl: req.headers.host + '/' + custom } };
   
    if(url)
    {
        Url.findOneAndUpdate({'code': req.params.code}, newvalues, async(err, data) => {
            if(err)
            res.send("Error");
        else    
        {
            const url2 = await Url.findOne({'code': custom});
            res.render('../views/url', {
                'url' : url2
        });  
        }
       

});
    }
    else
    {
        res.send("Invalid url code");
    }

});

router.get('/:code', async(req,res) => {
    const url = await Url.findOne({'code': req.params.code});

    if(url)
    {
        // checking validity of the url
    if(!validUrl.isUri(url.shorturl))
    {
        res.send("Invalid short url");
    }
        res.redirect(url.longurl);
    }

    else
    {
        res.send("URL not found");
    }
});

module.exports = router;
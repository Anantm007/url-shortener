const express =  require('express');
const router = express();
const validUrl = require('valid-url');
const shortid = require('shortid');
const Url = require('../models/Url');
var ejs = require('ejs');

// set up body-parser
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json({type: 'application/json'}));


// Home page
router.get('/', async(req,res) =>{
    res.render("../views/home",{
        'base': req.headers.host
    });
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
                'url' : oldurl,
                'message' : ""
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
          'url' : newurl2,
          'message' : ""
    });    
    }catch(err)
    {
        console.log(err);
    }

    }
});
  
// Adding custom code in url
router.post('/custom/:code', async(req,res) => {

    const {custom} = req.body;
    const url = await Url.findOne({'code': req.params.code});
    
    
    // check if custom code already exists
    const oldcustom = await Url.findOne({'code': custom})
    if(oldcustom)
    {
        res.render('../views/url', {
            'url': url,
            'message' : "code aleready exists, please create a unique one"
    });  
    }

    else
    {

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
                    'url' : url2,
                    'message' : ""
            });  
            }
           
    
    });
        }
        else
        {
            res.send("Invalid url code");
        }
    
    }
});

// Get all the short urls
router.get('/archive', async(req,res)=>{
    const urls  = await Url.find();

    res.render('../views/archive', {
       'urls' : urls
    });
});

// About page
router.get('/about', async(req,res) =>{    
    res.render("../views/about");
});

// Redirecting to the original URL
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
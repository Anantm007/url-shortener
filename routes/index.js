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
    return res.render("../views/home");
});


// Creating a new short url
router.post('/shorten', async (req, res) => {
    
    console.log(req.body);
    const {longurl, findbase} = req.body;

    const baseurl = findbase;

    // checking validity of base url
    if(!validUrl.isUri(baseurl))
    {
        return res.send("Invalid base url");
    }

    // checking validity of long url
    if(!validUrl.isUri(longurl))
    {
        return res.send("Invalid long url");
    }

    // Check if the long url already exists in the database
    const oldurl = await Url.findOne({'longurl': longurl});

    if(oldurl)
    {

            return res.render('../views/url', {
                'url' : oldurl,
                'message' : ""
            });
    }

    else
    {

    // Generate unique short id
    const code = shortid.generate();

    // Short URL
    const shorturl = baseurl + code;

    try{

        const newUrl = new Url({
            longurl: longurl,
            code: code,
            shorturl: shorturl,
            date: new Date()       
        });
        
        
        const newurl2 = await newUrl.save();
        
       
     return res.render('../views/url', {
          'url' : newurl2,
          'message' : ""
    });    
    }catch(err)
    {
        return res.send(err);
    }

    }
});
  
// Adding custom code in url
router.post('/custom/:code', async(req,res) => {

    const {custom, findbase} = req.body;
    
    // check if custom code already exists
    const oldcustom = await Url.findOne({'code': custom})
    if(oldcustom)
    {
        return res.render('../views/url', {
            'url': oldcustom,
            'message' : "Sorry, this code is aleready in use, please enter a new one"
    });  
    }

    else
    {
        const url = await Url.findOne({'code': req.params.code});

        const baseurl = 'http://' + findbase + '/';
        const urln = baseurl + custom;
        
        var newvalues = { $set: {code: custom, shorturl: urln } };
   
        if(url)
        {
            Url.findOneAndUpdate({'code': req.params.code}, newvalues, async(err, data) => {
                if(err)
                return res.send("Error");
            else    
            {
                const url2 = await Url.findOne({'code': custom});
                return res.render('../views/url', {
                    'url' : url2,
                    'message' : ""
            });  
            }
           
    
    });
        }
        else
        {
            return res.send("Invalid url code");
        }
    
    }
});

// Get all the short urls
router.get('/archive', async(req,res)=>{
    const urls  = await Url.find().sort({ date: -1 });

    return res.render('../views/archive', {
       'urls' : urls
    });
});

// About page
router.get('/about', async(req,res) =>{    
    return res.render("../views/about");
});

// Redirecting to the original URL
router.get('/:code', async(req,res) => {    
    
    const url = await Url.findOne({'code': req.params.code});

    if(url)
    {
        // checking validity of the url
    if(!validUrl.isUri(url.shorturl))
    {

        return res.send("Invalid short url");
    }
    var newvalues = { $set: {clicks: url.clicks+1} };
   
        Url.findOneAndUpdate({'code': req.params.code}, newvalues, async(err, data) => {
                if(err)
                return res.send("Error");
        });
        
        res.redirect(url.longurl);
    }

    else
    {
        return res.render('../views/errorpage');
    }
});


module.exports = router;
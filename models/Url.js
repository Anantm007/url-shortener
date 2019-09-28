const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    longurl:
     {
         type:String,
         required: true
    },
    code: 
    {
        type: String
    },

    shorturl: {
        type: String
    },
    date: 
    {
        type: String,
        default: Date.now
    },

});

module.exports = Url = mongoose.model('url', UrlSchema);
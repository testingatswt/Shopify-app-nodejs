const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Welcome to shopify app!");
});

let helper = require('../helpers/Helper');
let ShopsHelper = require('../helpers/Shops');

ShopsHelper.get_all().then( result => console.log(result)).catch( error => console.error("Error"));

// ShopsHelper.get('solution-win.myshopify.com').then( result => console.log(result)).catch( error => console.error("Error"));

// ShopsHelper.delete('solution-win.myshopify.com');

module.exports = router;
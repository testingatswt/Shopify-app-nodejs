const express = require('express');
const router = express.Router();
const app = express();
const dotenv = require('dotenv').config();
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const mongoose = require('mongoose');
let shopifyApi = require('../helpers/shopifyApi');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = process.env.SHOPIFY_APP_SCOPES;

const app_url =  process.env.APP_URL;
const Shops = require('../models/Shops');
const ShopHelper = require('../helpers/Shops');

router.get('/', (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = app_url + '/install/callback';
        const installUrl = 'https://' + shop +
        '/admin/oauth/authorize?client_id=' + apiKey +
        '&scope=' + scopes +
        '&state=' + state +
        '&redirect_uri=' + redirectUri;
        res.cookie('state', state);
        res.redirect(installUrl);
    }
    else{
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
});

router.get('/callback', (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
  
    if (state !== stateCookie) {
      return res.status(403).send('Request origin cannot be verified');
    }
  
    if (shop && hmac && code) {
      // DONE: Validate request is from Shopify
      const map = Object.assign({}, req.query);
      delete map['signature'];
      delete map['hmac'];
      const message = querystring.stringify(map);
      const providedHmac = Buffer.from(hmac, 'utf-8');
      const generatedHash = Buffer.from(
        crypto
          .createHmac('sha256', apiSecret)
          .update(message)
          .digest('hex'),
          'utf-8'
        );
      let hashEquals = false;
  
      try {
        hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
      } catch (e) {
        hashEquals = false;
      };
  
      if (!hashEquals) {
        return res.status(400).send('HMAC validation failed');
      }
  
      // DONE: Exchange temporary code for a permanent access token
      const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
      const accessTokenPayload = {
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      };
  
      request.post(accessTokenRequestUrl, { json: accessTokenPayload })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        // DONE: Use access token to make API call to 'shop' endpoint
        let shopify = shopifyApi.shopify(shop,accessToken);
          shopify.shop.get()
          .then((shops) => {
            let shop_data = {
              id: shops.id,
              name: shops.name,
              shop: shop,
              access_token: accessToken,
              hmac: hmac,
              domain: shops.domain,
              myshopify_domain: shops.myshopify_domain,
              country_name: shops.country_name,
              country_code: shops.country_code,
              plan_name: shops.plan_name,
              email: shops.email
            };
            ShopHelper.save(shop_data);
            res.redirect(process.env.AFTER_INSTALL_REDIRECT_TO);
          })
          .catch(err => console.error(err));
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
    } else {
      res.status(400).send('Required parameters missing');
    }
});

function save_shop(data) {
    console.log(data);
    
    Shops.findOne({'name': data.name}, (err,shops) => {
        if(err) throw err;
        if(!shops){
            let shops = new Shops(data);
            shops.save();
        }
        else{
            console.log("update here");
        }
    } );
}


router.get('/get', (req, res) => {
    Shops.find({}, (error,result) => {
        res.send(result);
    });
});
module.exports = router;
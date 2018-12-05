const Shopify = require('shopify-api-node');

exports.shopify = function (shop,accessToken){
    return new Shopify({
        shopName: shop,
        accessToken: accessToken
    });
};
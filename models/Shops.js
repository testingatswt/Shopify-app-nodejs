var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Shops = new Schema(
    {
        id: {
            type: String
        },
        name: {
            type: String
        },
        shop: {
            type: String
        },
        access_token: {
            type: String
        },
        hmac: {
            type: String
        },
        domain: {
            type: String
        },
        myshopify_domain: {
            type: String
        },
        country_name: {
            type: String
        },
        country_code: {
            type: String
        },
        plan_name: {
            type: String
        },
        email: {
            type: String
        },
        status: {
            type: String,
            default: 'active'
        },
        installed_on: {
            type: Date,
            default: new Date()
        },
        uninstalled_on: {
            type: Date,
            default: null
        }
    },
    {
        collection: 'shops'
    }
);

module.exports = mongoose.model('Shops', Shops);
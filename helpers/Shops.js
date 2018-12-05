const Shops = require("../models/Shops");

exports.get_all = async function () {
    let result;
    await Shops.find({}, (err,shops) => {
        if(err) throw err;
        result = shops;
    });
    return result;
};

exports.get = async function (shop) {
    let data;
    await Shops.findOne({myshopify_domain: shop}, (err,result) => {
        if(err) throw err;
        data = result;
    });
    return data;
};

exports.save = function (data) {
    Shops.findOne({myshopify_domain: data.myshopify_domain}, (err, shops) => {
        if(err) throw err;
        if(!shops){
            let shop = Shops(data);
            shop.save( (err,result) => {
                if(err) throw err;
                if(result){
                    console.log("Shop data saved. ", result);
                }
            });
        }
        else{
            let newValue = {
                $set:{
                    access_token: data.access_token
                }
            };
            Shops.updateOne({myshopify_domain: data.myshopify_domain},newValue,(err,result) => {
                if(err) throw err;
                if(result){
                    console.log("Shop data updated. ", result);
                }
            });
        }
    });
};

exports.update = function (data) {
    Shops.findOne({myshopify_domain: data.shop}, (err, shops) => {
        if(err) throw err;
        if(shops){
            Shops.updateOne( {myshopify_domain: data.shop} , data, (err,result) => {
                if(err) throw err;
                if(result){
                    console.log("Shop data updated. ", result);
                }
            });
        }
    });
};

exports.delete = function (shop) {
    Shops.deleteMany({myshopify_domain: shop}, (err,result) => {
        if(err) throw err;
        if(result){
            console.log(shop, " has been deleted,", result);
        }
    });
};
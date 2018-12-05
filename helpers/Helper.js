exports._id = function(length = 12) {
    var text = "";
    var result = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    for (var j=0; j < text.length; j++) {
        result += text.charCodeAt(j).toString(16);
    }
    return result;
};

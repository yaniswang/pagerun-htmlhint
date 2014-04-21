var HTMLHint = require('htmlhint').HTMLHint;

module.exports = function(pagerun){
    var self = this;
    var bOpenUrl = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        var config = self.config({});
        proxy.addFilter(function(httpData, next){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseType === 'html' &&
                    httpData.responseCode === 200 &&
                    responseContent !== undefined){
                        var messages = HTMLHint.verify(httpData.responseContent, config);
                        if(messages.length > 0){
                            self.result({
                                url: httpData.url,
                                messages: messages
                            });
                        }
                }
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
};
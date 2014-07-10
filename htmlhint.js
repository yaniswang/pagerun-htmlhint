var HTMLHint = require('htmlhint').HTMLHint;

module.exports = function(pagerun){
    var self = this;
    var config = self.config({});
    var bOpenUrl = false;
    var bSkip = false;
    pagerun.on('proxyStart', function(msg){
        var proxy = msg.proxy;
        var rules = config.rules;
        var once = config.once;
        proxy.addFilter(function(httpData, next){
            if(bOpenUrl === true){
                var responseContent = httpData.responseContent;
                if(httpData.responseType === 'html' &&
                    httpData.responseCode === 200 &&
                    responseContent !== undefined && bSkip === false){
                        var messages = HTMLHint.verify(httpData.responseContent, rules);
                        if(messages.length > 0){
                            self.warn({
                                url: httpData.url,
                                messages: messages
                            });
                        }
                        bSkip = once === true;
                }
            }
            next();
        });
    });
    pagerun.on('webdriverOpenUrl', function(){
        bOpenUrl = true;
    });
};
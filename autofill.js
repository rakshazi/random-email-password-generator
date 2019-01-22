/**
 * Generate values
 */
var generate = {
    _pattern : /[a-zA-Z0-9_\-\+\.]/,
    _login: Math.random().toString(36).substring(2),

    _getRandomByte : function() {
        if(window.crypto && window.crypto.getRandomValues){
            var result = new Uint8Array(1);
            window.crypto.getRandomValues(result);
            return result[0];
        }else if(window.msCrypto && window.msCrypto.getRandomValues){
            var result = new Uint8Array(1);
            window.msCrypto.getRandomValues(result);
            return result[0];
        }else{
            return Math.floor(Math.random() * 256);
        }
    },

    login: function () {
        return this._login;
    },

    email: function (domain) {
        suffix = '@' + domain;
        domain = window.location.hostname.split('.').join('');
        if(domain == '') {
            domain = this.login();
        }
        return domain + suffix;
    },

    password: function (length) {
        return Array.apply(null, {'length': length}).map(function(){
            var result;
            while(true){
                result = String.fromCharCode(this._getRandomByte());
                if(this._pattern.test(result)){
                    return result;
                }
            }}, this).join('');
    }
}

/**
 * Collect fields
 */
var collect = {
    login: function () {
        return document.querySelectorAll("input[name=login], input[name=username]");
    },
    email: function () {
        return document.querySelectorAll("input[type=email], input[name=email], input[name=mail]");
    },
    password: function () {
        return document.querySelectorAll("input[type=password], input[name=password]");
    },
}

//Load options
chrome.storage.sync.get(['domain', 'passwordLength'], function(items) {
    window.randomAutofillOptions = items;
});
//Prepare fields
var loginFields = collect.login();
var emailFields = collect.email();
var passwordFields = collect.password();

//Set values
for(var i = 0; i < loginFields.length; i++) {
    loginFields[i].value = generate.login();
}
for(var i = 0; i < emailFields.length; i++) {
    var emailField = emailFields[i];
    chrome.storage.sync.get('domain', function(data){
        emailField.value = generate.email(data.domain);
    });
}
for(var i = 0; i < passwordFields.length; i++) {
    var passwordField = passwordFields[i];
    chrome.storage.sync.get('passwordLength', function(data){
        passwordField.value = generate.password(data.passwordLength);
    });
}

/**
 * Created by Alejandro Antivero on 26/08/2014.
 * Archivo de configuracion para el uso de las apis
 */
module.exports = {
    'facebookAuth' : {
        'clientID' : '',
        'clientSecret' : '',
        'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
    },
    'twitterAut' : {
        'consumerKey' : '',
        'consumerSecret' : '',
        'callbackURL' : 'http://localhost:8080/auth/twitter/callback'
    },
    'googleAuth' : {
        'clientID' : '',
        'clientSecret' : '',
        'callbackURL' : 'http://localhost:8080/auth/google/callback'
    }
};
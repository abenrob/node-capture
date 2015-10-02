'use-strict';

var fs = require('fs');
var _ = require('lodash');
var driver = require('node-phantom-simple');
var chalk = require('chalk');
var phantomjs = require('phantomjs');
var Q = require("q");

var capture = function(opts){

    var deferred = Q.defer();

    // declare variables and extend settings
    // current date string for image naming
    var now = new Date().toISOString().split('T')[0] // '2015-08-07T16:33:29.571Z' => '2015-08-07'
    var settings = _.assign({},
        {
            mode: 'base64',
            viewport_width: 1440,
            viewport_height: 900,
            delay: 1000,
            selector: 'body',
            css_file: '',
            user_agent: null,
            out_file: './image_' + now + '.png'
        }, opts);

    // Append 'http://' if protocol not specified
    if (!settings.url.match(/^\w+:\/\//)) {
        settings.url = 'http://' + settings.url;
    }

    var css_text;
    if (settings.css_hide) {
        css_text = settings.css_file += "\n\n " + settings.css_hide + " { display: none !important; }\n";
    }

    console.log( "Processing: " + settings.url );

    driver.create({ path: phantomjs.path }, function (err, browser) {
        if (err){
            deferred.reject(err);
            return;
        }
        browser.createPage(function (err, page) {
            if (err){
                browser.exit();
                deferred.reject(err);
                return;
            }
            page.set('onError', function() { return; });
            page.onConsoleMessage = function (msg) { console.log(chalk.yellow('Phantom console msg:'), msg); };
            page.set('viewportSize', {width: settings.viewport_width, height: settings.viewport_height});

            page.open(settings.url, function (err,status) {
                if (err){
                    browser.exit();
                    deferred.reject(err);
                    return;
                }
                console.log("opened site? ", status);
                page.evaluate(function(cssText,selector){
                    if (cssText) {
                        var style = document.createElement('style');
                        style.appendChild(document.createTextNode(cssText));
                        document.head.appendChild(style);
                    }
                    var element = document.querySelector(selector);
                    return {rect: element.getBoundingClientRect()};
                }, css_text, settings.selector ,function (err,results) {
                    if (err){
                        browser.exit();
                        deferred.reject(err);
                        return;
                    }
                    page.set('clipRect', results.rect);
                    if (settings.mode != 'save'){
                        console.log(chalk.green('\nWriting to base64... '));
                        page.renderBase64('PNG', {quality: '100'}, function(err,base64){
                            browser.exit();
                            if (err){
                                deferred.reject(err);
                                return;
                            }
                            deferred.resolve({base64:base64});
                        });
                    }else{
                        console.log(chalk.green('\nWriting to file... ') + settings.out_file);
                        page.render(settings.out_file, {quality: '100'}, function(err){
                            browser.exit();
                            if (err){
                                deferred.reject(err);
                                return;
                            }
                            deferred.resolve({file:settings.out_file});
                        });
                    }
                });
            });
        });
    });

    return deferred.promise;
};

module.exports = {
    capture: capture
};
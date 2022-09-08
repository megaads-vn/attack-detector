module.exports = new Start();

const schedule = require('node-schedule');
const appConfig = require(__dir + '/app/config/app');
const UrlParser = require(__dir + "/app/log-parser/parser/url-parser");
const KeywordParser = require(__dir + "/app/log-parser/parser/keyword-parser");
const IpParser = require(__dir + "/app/log-parser/parser/ip-parser");
const Monitor = require(__dir + "/app/monitor/monitor");
const App = require(__dir + "/app/core/server");

function Start() {

    this.start = function() {
        boot();
    }

    function boot() {

        if (appConfig.mode.url == 'on') {
            const job = schedule.scheduleJob('*/30 * * * * *', function() {
                let urlParser = new UrlParser();
                urlParser.init();    
            });
        }

        setTimeout(function () {
            if (appConfig.mode.keyword_in_url == 'on') {
                const job = schedule.scheduleJob('*/30 * * * * *', function() {
                    let keywordParser = new KeywordParser();
                    keywordParser.init();
                });
            }
        }, 15 * 1000);
        

        if (appConfig.mode.ip == 'on') {
            const job = schedule.scheduleJob('*/45 * * * * *', function() {
                let ipParser = new IpParser();
                ipParser.init();
            });
        }

        const job = schedule.scheduleJob('*/25 * * * * *', function() {
            let monitor = new Monitor();
            monitor.init();    
        });

    }

}


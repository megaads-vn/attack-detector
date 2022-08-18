module.exports = Schedule;

const schedule = require('node-schedule');
const appConfig = require(__dir + '/config/app');
const UrlParser = require(__dir + "/app/log-parser/parser/url-parser");
const KeywordParser = require(__dir + "/app/log-parser/parser/keyword-parser");
const IpParser = require(__dir + "/app/log-parser/parser/ip-parser");

function Schedule() {

    this.init = function() {
        start();
    }

    function start() {
        if (appConfig.mode.url == 'on') {
            console.log('Schedule for UrlParser');
            const job = schedule.scheduleJob('*/30 * * * * *', function() {
                const urlParser = new UrlParser();
                urlParser.init();    
            });
        }

        setTimeout(function () {
            if (appConfig.mode.keyword_in_url == 'on') {
                console.log('Schedule for KeywordParser');
                const job = schedule.scheduleJob('*/30 * * * * *', function() {
                    const keywordParser = new KeywordParser();
                    keywordParser.init();
                });
            }
        }, 15 * 1000);
        

        if (appConfig.mode.ip == 'on') {
            console.log('Schedule for IpParser');
            const job = schedule.scheduleJob('*/45 * * * * *', function() {
                const ipParser = new IpParser();
                ipParser.init();
            });
        }
    }

}


module.exports = AbtractParser;

const appConfig = require(__dir + '/config/app');
const Utils = require(__dir + '/app/helper/utils');

function AbtractParser() {
    
    var self = this;
    
    this.path = appConfig.path;
    this.numberLine = appConfig.number_line;
    this.ipIgnores = appConfig.ip_ignore;
    this.keywords = appConfig.keywords;
    this.siteName = appConfig.site_name;

    this.excCommand = function () {
        throw new Error("not implemented");
    }
    
    this.parserLog = function () {
        throw new Error("not implemented");
    }

    this.convertToArrayByNewLine = function (str) {
        return str.split(/\r?\n/);
    }

    this.sendEmail = function (subject, content, attachments) {
        Utils.sendEmail(subject, content, attachments)
    }

}
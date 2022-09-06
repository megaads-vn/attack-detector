module.exports = AbtractParser;

const appConfig = require(__dir + '/app/config/app');

function AbtractParser() {
    
    var self = this;
    
    this.path = appConfig.path;
    this.numberLine = appConfig.number_line;
    this.ipIgnores = appConfig.ip_ignore;
    this.keywords = appConfig.keywords;
    this.siteName = appConfig.site_name;
    this.numberRequestWarning = appConfig.number_request_warning;

    this.excCommand = function () {
        throw new Error("not implemented");
    }
    
    this.parserLog = function () {
        throw new Error("not implemented");
    }

    this.convertToArrayByNewLine = function (str) {
        return str.split(/\r?\n/);
    }
}
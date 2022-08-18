module.exports = {
    mode: {
        url: "on", // on|off
        keyword_in_url: "on",
        ip: "on"
    }, 
    path: "/Users/nguyenkimtung/Downloads/logfile/test/access_log", // đường dẫn tới file access_log
    number_line: 5000, // số dòng đọc cuối file để parse log
    ip_ignore: [],
    keywords: [
        "page=", 
        "search?q="
    ],
    site_name: "chiaki.vn"
}
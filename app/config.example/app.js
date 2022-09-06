module.exports = {
    mode: {
        url: "on", // on|off
        keyword_in_url: "on",
        ip: "on"
    }, 
    path: "/var/log/httpd/access_log", // đường dẫn tới file access_log
    number_line: 5000, // số dòng đọc cuối file để parse log
    number_request_warning: 1000,
    ip_ignore: [],
    keywords: [
        "page=", 
        "search?q="
    ],
    site_name: "chiaki.vn"
}
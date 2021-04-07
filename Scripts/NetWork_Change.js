//event network-changed script-path=https://raw.githubusercontent.com/Wangsc1/All/master/Scripts/Caiyun.js
//version: 2.2
//auther: tempoblink

//The Notification Format.
let TITLE = 'Surge运行模式';
let SUBTITLE_CELLULAR = '数据网络: ';
let SUBTITLE_WIFI = '无线网络: ';
let ABOUT_MODE = '运行模式: ';
let ABOUT_IP = '当前地址: ';
let CHINA_MOBILE = "中国移动";
let CHINA_UNICOM = "中国联通";
let CHINA_TELECOM = "中国电信";
let CHINA_TIETONG = "中国铁通";

//white ssid and black ssid.
let ALLOWLIST = [
            "home_ssid1",
            "home_ssid2"
    ];
let BLOCKLIST = [
            "free_ssid1",
            "free_ssid2"
    ];

//The default outbound: 'Direct' or 'Rule' or 'Global-proxy'.
let BlockList = "直接连接";
let AllowList = "规则模式";
let Others = "规则模式";
let Cellular = "规则模式";

function changeOutboundMode(mode) {
    ABOUT_IP += $network.v4.primaryAddress;
    if($surge.setOutboundMode(mode.toLowerCase()))
        $notification.post(TITLE, NETWORK, ABOUT_MODE + mode + '\n' + ABOUT_IP);
}

//wifi select outbound
let NETWORK = "";
if ($network.v4.primaryInterface == "en0") {
    NETWORK += SUBTITLE_WIFI + $network.wifi.ssid;
    if (BLOCKLIST.indexOf($network.wifi.ssid) != -1) {
        changeOutboundMode(BlockList);
    } else if (ALLOWLIST.indexOf($network.wifi.ssid) != -1) {
        changeOutboundMode(AllowList);
    } else {
        changeOutboundMode(Others);
    }
}else if($network.v4.primaryInterface == "pdp_ip0") {
    let CARRIER = $network['cellular-data'].carrier;  
    if(CARRIER == "460-00" || CARRIER == "460-02" || CARRIER == "460-07") SUBTITLE_CELLULAR += CHINA_MOBILE;
    else if(CARRIER == "460-01" || CARRIER == "460-06" || CARRIER == "460-09") SUBTITLE_CELLULAR += CHINA_UNICOM;
    else if(CARRIER == "460-03" || CARRIER == "460-05" || CARRIER == "460-11") SUBTITLE_CELLULAR += CHINA_TELECOM;
    else if(CARRIER == "460-20") SUBTITLE_CELLULAR += CHINA_TIETONG;
    NETWORK += SUBTITLE_CELLULAR + " " + $network['cellular-data'].radio;
    changeOutboundMode(Cellular);
}

$done();
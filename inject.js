/* global chrome:false */
var s = document.createElement('script');
s.src = chrome.extension.getURL('helper.js');
document.body.appendChild(s);

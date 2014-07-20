var $ = require('jquery')
, attachFastClick = require('fastclick')
, bootstrap = require('bootstrap');

$(function() {
  // Eliminates tap -> event delay on mobile browsers
  attachFastClick(document.body);
});
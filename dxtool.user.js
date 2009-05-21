// ==UserScript==
// @name           DXTool
// @namespace      no.wattengard.DXTool
// @include        http*://www.dealextreme.com/*
// ==/UserScript==

// JQuery Integration taked from: http://internetducttape.com/2008/05/08/greasemonkey-ninja-jquery/
// Example from http://www.joanpiedra.com/jquery/greasemonkey/

// Add jQuery
    var GM_JQ = document.createElement('script');
    GM_JQ.src = 'http://jquery.com/src/jquery-latest.js';
    GM_JQ.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(GM_JQ);

// Check if jQuery's loaded
    function GM_wait() {
        if(typeof unsafeWindow.jQuery == 'undefined') { window.setTimeout(GM_wait,100); }
	    else { $ = unsafeWindow.jQuery; letsJQuery(); }
    }
    GM_wait();

var currency;
// All your GM code must be inside this function
    function letsJQuery() {
      //alert('Test');
      var dollar = $('#_ctl0_content_Price');
      var dollarvalue = ltrim(dollar.text(), '\$');
      $.getJSON("http://pipes.yahoo.com/wattengard/tollcurrency?_render=json&dollar=" + dollarvalue + "&_callback=?",
        function(data){
          currency = data.value.items[0].currency;
          
          
          if (document.URL.match('details') != 'undefined') indyPage();
          //if (typeof $('') != 'undefined') invoicePage();
          if (document.URL.match('invoice') != 'undefined') invoicePage();
          //invoicePage();
          if (document.URL.match('products') != 'undefined') productsPage();
          
          if (document.URL.match('shoppingcart') != 'undefined') cartPage();
        
        });
    }
    
    function cartPage() {
      var dollar = $('#_ctl0_content_lblGrandTotal');
      var dollarvalue = ltrim(dollar.text(), '\$');
      var nok = dollarvalue * currency;
      dollar.append('  <i>(kr ' + roundNumber(nok,2) + ')</i>');
      if (nok > 200) dollar.css('color','red');
    }
    
    function indyPage() {
      var dollar = $('#_ctl0_content_Price');
      var dollarvalue = ltrim(dollar.text(), '\$');
      var nok = dollarvalue * currency;
      dollar.append('  <i>(kr ' + roundNumber(nok,2) + ')</i>');
      
    
    }
    
    function invoicePage() {
      var totalsrow = $('#table9 tr:last');
      var value = $('#table9 tr:last td:last span');
      //alert(value.text());
      var nok = value.text() * currency;
      totalsrow.after('<tr><td style="text-align:right;">Nok: </td><td>kr ' + roundNumber(nok,2) + '</td></tr>');
      var newrow = $('#table9 tr:last');
      if (nok > 200) {
        newrow.css('color','red');
        
      }
      //$('#table9 tr:last').after('<td>NOK:</td><td>kr 0.00</td>');
    
    }
    
    function productsPage() {
      var productlist = $('.ProductsDisplay:first div');
      productlist.each(function (index, domEle) {
        var price = $('table tbody tr td b font');
        //document.write('<!-- FOO ' + price.text()+ ' -->');
        
        if (trim(price) != '') {
          var value = trim(price);
          var nok = value * currency;
          price.after('<br/><sub>kr ' + nok + '</sub>');
        }
      });
    
    }
    
    
/** For åjelpe åage nye konverteringer
    
    function skeleton() {
      var dollar = $('#_ctl0_content_Price');
      var dollarvalue = ltrim(dollar.text(), '\$');
      $.getJSON("http://pipes.yahoo.com/wattengard/tollcurrency?_render=json&dollar=" + dollarvalue + "&_callback=?",
        function(data){
          //alert("JSON Data: " + data.value.items[0].result);
          dollar.append('  <i>(kr ' + data.value.items[0].result + ')</i>');
        });
    
    }
*/

/**
*
*  Javascript trim, ltrim, rtrim
*  http://www.webtoolkit.info/
*
**/
 
function trim(str, chars) {
	return ltrim(rtrim(str, chars), chars);
}
 
function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function roundNumber(rnum, rlength) { // Arguments: number to round, number of decimal places
  var newnumber = Math.round(rnum*Math.pow(10,rlength))/Math.pow(10,rlength);
  return newnumber; // Output the result to the form field (change for your purposes)
}

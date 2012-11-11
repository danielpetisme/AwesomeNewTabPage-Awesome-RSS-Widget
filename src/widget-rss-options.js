/*
 * The MIT License
 *
 * Copyright (c) 2012, Daniel Petisme
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Background
var bp = chrome.extension.getBackgroundPage();

//Basically, load the instance, set all the form values and save the updated instance
function persist() {  
  var instance = load();
  //Retrieve and set the form values
  instance.url = $("#url").val();
  instance.nbEntries = $("#nbEntries").val(); 
  //Clean existing RSS news
  if(instance.feed){
    instance.feed = {};
  }
  save(instance);
  //Trigger the backgrounf.js update
  bp.update(); 
  goBack2antp();
}

//Load the instance and reset the form field with its values
function reset() {
  var instance = load();

  
  $("#widgetUniqueId").text(getWidgetUniqueId);

  if ( instance.lastUpdate ) {
      var jsTimestamp = new Date(instance.lastUpdate * 1000);
      $("#lastUpdate").text("{0}-{1}-{2} {3}:{4}:{5}".format(
      jsTimestamp.getFullYear(),
      jsTimestamp.getMonth(),
      jsTimestamp.getDate(),
      jsTimestamp.getHours(),
      jsTimestamp.getMinutes(),
      jsTimestamp.getSeconds()
      ));
  }

  $("#url").val(instance.url || DEFAULT_RSS_URL);
  $("#nbEntries").val(instance.nbEntries || DEFAULT_RSS_NB_ENTRIES);
}

//Go back to the ANTP page
function goBack2antp() {
  window.location = ANTP_LOCATION;
}

//When we load the page we reset the form and set up form listeners
$(document).ready(function() {
  reset();

  $("form").submit(function(e) {
    saveConfig();
    e.preventDefault();
  });

  $("#reset").click(function(e) {
    reset();
    e.preventDefault();
  });

  $("#persist").click(function(e) {
    persist();
    e.preventDefault();
  });

  $("#antp").click(function(e) {
    goBack2antp();
    e.preventDefault();
  });
});

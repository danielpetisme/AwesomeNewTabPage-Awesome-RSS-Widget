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

//Load the data of this tile otherwise it creates the tile's data structure (cf. common-rss.js)
function loadOrCreateRss(){
  //it loads the instance or create a blank if it doesn't exist
  var instance = load();
  //update the last access to force the refresh
  instance.lastUpdate = generateTimestamp();
  save(instance);
      
}
//Clear the HTML outputs to prevent some UI errors
function clearDisplay(){
  $("#widget-rss-header").html(''); //Reset the header
  $("#widget-rss-feed-container").html(''); //Reset the feeds
}

//Simply display the RSS
function display(instance){
  console.debug("[ANTP-Widget-RSS] Display ID: {0}".format(getWidgetUniqueId()));
  if(instance.url){ //The widget is configured
    //We reset the current rendering
    clearDisplay();         
    //Link to the RSS provider website
    var feed = instance.feed;
    $("#widget-rss-header").html(' \
        <div class="well well-small header-container header-grey"> \
          <h3><a href="{0}" target="_blank" ><strong>{1}</strong></a></h3> \
        <div>'.format(feed.link, feed.title));
    //Display each entry title & link
    $.each(feed.entries, function(index, entry){
      $('#widget-rss-feed-container').append(' \
        <div class="row-fluid"> \
          <div class="span1 prepended-arrow-container"><i class="icon-chevron-right"></i></div> \
          <div class="span11 entry-container"><a href="{0}" target="_blank" >{1}</a></div> \
        </div>'.format(entry.link, entry.title));
    });      
  } else {
    console.debug("[ANTP-Widget-RSS] ID: {0} is not configured.".format(getWidgetUniqueId()));    
    $("#widget-rss-header").html(' \
      <div class="well well-small header-container"> \
        <h3><a href="{0}" target="_blank" ><strong>Configure it</strong></a></h3> \
      </div>'.format(INSTANCE_OPTIONS_LOCATION));
  }
}

//Basically, the aim is to refresh the UI with the latest updates
function update(){
  console.debug("[ANTP-Widget-RSS] Updating ID: {0}".format(getWidgetUniqueId()));
  var instance = load();
  display(instance);
}

/* -------------------------------------- */
/*                 Main                   */
/* -------------------------------------- */

//first of all we force the initialization
loadOrCreateRss();

//Event handling
$(document).ready(function() {
 // Initial setup of the widget
  update(); 

  // When anything in localStorage changes
  $(window).bind("storage", function (e) {
    if(e.originalEvent.key === getWidgetUniqueId()) {
      update();
    }
  });

});




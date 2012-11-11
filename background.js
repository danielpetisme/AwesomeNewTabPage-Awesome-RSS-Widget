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

// For https://chrome.google.com/webstore/detail/mgmiemnjjchgkmgbeljfocdjjnpjnmcg

// Learn more about poke v3 here:
// http://wiki.antp.co/
var info = {
  "poke"    :   3,              // poke version 2
  "width"   :   2,              // 406 px default
  "height"  :   1,              // 200 px default
  "path"    :   "widget-rss.html",
  "v2"      :   {
                  "resize"    :   true,   // Set to true ONLY if you create a range below.
                                          // Set to false to disable resizing
                  "min_width" :   2,      // Required; set to default width if not resizable
                  "max_width" :   2,      // Required; set to default width if not resizable
                  "min_height":   1,      // Required; set to default height if not resizable
                  "max_height":   5       // Required; set to default height if not resizable
                },
  "v3"      :   {
                  "multi_placement": true // Allows the widget to be placed more than once
                                          // Set to false unless you allow users to customize each one
                }
};

chrome.extension.onMessageExternal.addListener(function(request, sender, sendResponse) {
  if(request === "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-poke") {
    chrome.extension.sendMessage(
      sender.id,
      {
        head: "mgmiemnjjchgkmgbeljfocdjjnpjnmcg-pokeback",
        body: info,
      }
    );
  }
});
// Above is the required poke listener
// DO NOT MODIFY ANY OF THE ABOVE CODE

/* -------------------------------------- */
/*          Widget RSS specific           */
/* -------------------------------------- */

//To be sure there is at least one instance and to ease exception handling
localStorage.setItem(DEFAULT_RSS_ID, JSON.stringify(DEFAULT_RSS_INSTANCE));

//For each defined instance, try to load & save the latest RSS news
function update() {  
  //for each instance
  for (instanceId in localStorage) {
    var instance = JSON.parse(localStorage[instanceId]);
    //if it's configured, load the RSS feed
    if(instance.url){      
      console.debug("[ANTP-Widget-RSS] Reloading ID:{0} - {1}".format(instance.id, instance.url));
      /*
       * Closures (aka. success callback anonymous function) are trickies to handle inside a loop. to fix the
       * parameter passing to the closure I've used so following explanation:       
       * http://stackoverflow.com/questions/6978911/closure-inside-a-for-loop-callback-with-loop-variable-as-parameter
       * Finally, I've implemented a inline sefl-executing function to be able to invoke the anonymous function,
       * with the appropriate parameters.              
       */       
      (function(rss) {
        //To fix the CSP issue with a remote script invokation, http://blog.syedgakbar.com/2012/09/
        var rssQueryUrl = 'https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num={0}&q={1}'.format(rss.nbEntries,encodeURIComponent(rss.url));
        console.debug("[ANTP-Widget-RSS] Querying {0}".format(rssQueryUrl));
        $.ajax({
          url: rssQueryUrl,
          dataType: 'jsonp',
          success: function(data) {
            console.log("[ANTP-Widget-RSS] Data retrieved: " + data);            
            //To be sure to delete all previsous data, I reset it
            rss.feed = {};
            save(rss);         
            //Retrieve the latest feeds
            rss.feed = data.responseData.feed;
            //store the RSS data
            save(rss);         
          }
      });     
      })(instance);
    }  
  }  
}

//Right now we do a first global update...
update();

//... and every hour
setInterval(update, 1*60*60*1000);

//... and each time that the background or an instance save something
$(window).bind("storage", function (e) {
  update();
});


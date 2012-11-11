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

/* -------------------------------------- */
/*                Utils                   */
/* -------------------------------------- */

//The actual chrome extension ID
var EXTENSION_ID = chrome.i18n.getMessage("@@extension_id")

//Convenient function to prevent ugly String concatenation
// The tokens are {0}, {1}, etc.
String.prototype.format = function() {
    var args = arguments;

    return this.replace(/\{(\d+)\}/g, function() {
        return args[arguments[1]];
    });
};

//Nothing more to say ;-)
function generateTimestamp(){
  // Divide by 1000 to have the timestamp in seconds rather than milliseconds  
  return Math.round(new Date().getTime()/1000.0);   
}


/* -------------------------------------- */
/*            ANTP facilities             */
/* -------------------------------------- */

var ANTP_LOCATION = "chrome-extension://mgmiemnjjchgkmgbeljfocdjjnpjnmcg/ntp.html";
var OPTIONS_LOCATION = "chrome-extension://{0}/widget-rss-options.html".format(EXTENSION_ID);

function getWidgetUniqueId() {
  try {
    if ( window.location.hash ) {
      return JSON.parse( decodeURIComponent(window.location.hash).substring(1) ).id;
    } else {
      return DEFAULT_RSS_ID;
    }
  } catch(e) {
    return DEFAULT_RSS_ID;
  }
}

/* -------------------------------------- */
/*         Widget RSS Specific            */
/* -------------------------------------- */

/*
 * The instance options are located at: chrome-extension://<EXTENSION_ID>/widget-rss-options.html#<INSTANCE_ID_STRUCTURE>
 * -The INSTANCE_ID_STRUCTURE is the string encoded representation of: {"id": <INSTANCE_ID>}
 */
var INSTANCE_ID_STRUCTURE = encodeURIComponent(JSON.stringify({id : getWidgetUniqueId()}));
var INSTANCE_OPTIONS_LOCATION = "{0}#{1}".format(OPTIONS_LOCATION, INSTANCE_ID_STRUCTURE);

/* --- Widget RSS Structure --- */
/*
  widget = {
  id,            - The is of this particular tile
  nbEntries,     - The number of the feed's entries to retrieve
  url,           - The url to the actual RSS feed
  updateDate,    - The timestamp of the last update of the Rss
  feed : {       - The RSS feed retrieved thanks to http://ajax.googleapis.com    
    title,       - The RSS feed's title
    link,        - The original Website link
    entries      - The latest entries
  }

}
*/

/* --- Default constants values ---*/
var DEFAULT_RSS_ID = "default";
var DEFAULT_RSS_NB_ENTRIES = 3;
var DEFAULT_RSS_URL = "";

var DEFAULT_RSS_INSTANCE = {
  id: DEFAULT_RSS_ID,
  nbEntries: DEFAULT_RSS_NB_ENTRIES,
  url: DEFAULT_RSS_URL
};

/* --- Persistence --- */
//load en existiçng instance or create a blank one
function load(){  
  var instance = JSON.parse(localStorage.getItem(getWidgetUniqueId()));
  //if the instance does not exit, it create a blank one
  if(!instance) {
    console.debug("[ANTP-Widget-RSS] Creating new instance with ID: {0}".format(getWidgetUniqueId()));
    instance = {
      id: getWidgetUniqueId(),
      lastUpdate: generateTimestamp()
    };
  }
  return instance;
}
function save(instance) {
  localStorage.setItem(instance.id, JSON.stringify(instance));
}
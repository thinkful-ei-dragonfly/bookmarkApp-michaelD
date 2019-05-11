/* global $, bookmarkApp, store, api */


// NEED TO IMPLEMENT the HTML structure of what the items on the bookmarks list will look like
// Refer to workup for visual structure (need delete button && when isDetailedView: true show full desc
// and url)
// make a toggleIsDetailedView in bookmarksapp

'use strict';

$.fn.extend({
  serializeJson: function() {
    if (!this.is('form')) throw new TypeError('Must run serializeJson on FORM elements only');
    
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, field) => {
      o[field] = val; 
    });
  
    return JSON.stringify(o);
  }
});


// Build the (main) function to build initial page state
$(() =>  {
  bookmarkApp.bindEventListeners();

  //should fetch bookmarks on initial load
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkApp.render();
    })
    .catch(err => console.log(err.message));
});

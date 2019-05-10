/* global $, bookmarkApp, store, api */

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

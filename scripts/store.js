'use strict';

/* This is a store program. It will be an IFFE statement just as it was in the
shopping list example. Its purpose is to do things like add 'bookmarks' to the <ul>
it also holds other values like 'isAdding:(true || false)' which decides what 
how  <form id="js-bookmark-list-form"> will display:
(buttons&dropDown elements || enterNewBookmark elements)
Add Bookmark is pressed => enterNewBookmark shows 
the return at the bottom sets up the empty list, 
and the properties of the store */

// eslint-disable-next-line no-unused-vars
const store = (function() {
  const setError = function(error) {
    this.error = error;
  };

  const _toStore = function(bookmark){
    return Object.assign(bookmark, {isDetailedView:false})
  }
  const addBookmark = function(bookmark) {
    this.bookmarks.push(_toStore(bookmark));

  };

  const findById = function(id){
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  // handles toggles new bookmark form from 
  const toggleNewBookmarkForm = function() {
    this.newBookmarkForm = !this.newbookmarkForm;
  };

  // sets state of selected bookmark in bookmarks[] to isDetailedView
  const toggleBookmarkDetailedView = function (id) {
    const bookmark = this.findById(id);
    bookmark.isDetailedView = !bookmark.isDetailedView;
  };

  const setMinRating = function(rating) {
    this.minumumRating = rating;
  };

  return {
    bookmarks: [],
    error: null,
    newBookmarkForm: false,
    minimumRating: 0,

    addBookmark,
    setError,
    findById,
    findAndDelete,
    toggleNewBookmarkForm,
    toggleBookmarkDetailedView,
    setMinRating,
  }; 

}());



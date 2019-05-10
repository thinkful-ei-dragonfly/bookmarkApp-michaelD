/* global store */
'use strict';
/* 
This is a store program. It will be an IFFE statement just as it was in the
shopping list example. Its purpose is to do things like add 'items' to the <ul>
it also holds other values like 'isAdding:(true || false)' which decides what how 
<form id="js-bookmark-list-form"> will display:
(buttons&dropDown elements || enterNewBookmark elements)
Add Bookmark is pressed => enterNewBookmark shows 
the return at the bottom sets up the empty list, and the properties of the store
*/

// eslint-disable-next-line no-unused-vars
const store = (function() {
  const setError = function(error) {
    this.error = error;
  };

  const addItem = function(id, title, desc, url, stars) {
    this.items.push(id);
    const item = this.findById(id);
    item.title = title;
    item.desc = desc;
    item.url = url;
    item.stars = stars;
  };

  const findById = function(id){
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(item => item.id !== id);
  };

  // handles 'Add Bookmark' & cancel button to change state of bookmark-app
  const toggleNewItemForm = function() {
    this.newItemForm = !this.newItemForm;
  };

  // sets state of selected item in items[] to isDetailedView
  const toggleItemDetailedView = function (id, isDetailedView) {
    const item = this.findById(id);
    item.isDetailedView = isDetailedView;
  };

  const setMinStars = function(stars) {
    this.minumumStars = stars;
  };

  return {
    items: [],
    error: null,
    newItemForm: false,
    minimumStars: 0,

    addItem,
    setError,
    findById,
    findAndDelete,
    toggleNewItemForm,
    toggleItemDetailedView,
    setMinStars,
  }; 

}());


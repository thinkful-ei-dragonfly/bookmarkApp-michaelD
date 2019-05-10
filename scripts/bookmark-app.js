/* global store, $ */
'use strict';
/* this bookmarkApp handles all the funcitonality for adding and removing
Bookmarks to the the store[]. Like store.js it is an IIFE staement
store.js manipulate the store | think array[]
bookmarkApp manipulates the items in the store | think array[id] */

// eslint-disable-next-line no-unused-vars
const bookmarkApp = (function(){

  // generates the error message, which starts off as 'null' in store.js
  function generateError(message) {
    return `
      <section class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    const detailedClass = item.detailedView ? 'bookmark-item__detailed' : '';

    let itemTitle = `<span class="bookmark-item ${detailedClass}">${item.name}</span>`;
    if (item.isDetailedView) {
      itemTitle = `
        <form class="js-edit-item">
          <input class="bookmark-item type="text" value="${item.name}" />
        </form>
      `;
    }
  
    return `
      <li class="js-item-element" data-item-id="${item.id}">
        ${itemTitle}
        <div class="bookmark-item-controls">
          </button>
        </div>
      </li>`;
  }
  

  function generateBookmarkItemsString(bookmarkApp) {
    const items = bookmarkApp.map((item) => generateItemElement(item));
    return items.join('');
  }

  function renderError() {
    if (store.error) {
      const el = generateError(store.error);
      $('.error-container').html(el);
    } else {
      $('.error-container').empty();
    }
  }
  function render() {
    renderError();
    let items = [...store.items ];

    //Filter list to only show items with stars >= minimumStars
    if (store.minumStars > 0) {
      items = items.filter(item => item.stars >= store.minimumStars);
    }
    
    // show console that render has run, gen a bookListItemsString
    console.log('`render` ran');
    const bookmarkListItemsString = generateBookmarkItemsString(items);
      
    // insert that HTML string into the DOM
    $('.js-bookmark-list').html(bookmarkListItemsString);
  }


  function handleToggleNewItemForm () {

  }
  function handleNewItemSubmit() {

  }

  function





  function bindEventListeners() {
    // handleSomething();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
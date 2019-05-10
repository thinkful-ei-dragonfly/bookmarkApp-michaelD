/* global store, $, api */
'use strict';
/* this bookmarkApp handles all the funcitonality for adding and removing
Bookmarks to the the store[]. Like store.js it is an IIFE staement
store.js manipulate the store | think array[]
bookmarkApp manipulates the bookmarks in the store | think array[id] */

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

  function generateBookmarkElement(bookmark) {
    const detailedClass = bookmark.isDetailedView ? 'bookmark-__detailed' : '';

    let bookmarkTitle = `<span class="bookmark-bookmark ${detailedClass}">${bookmark.title}</span>`;
    if (bookmark.isDetailedView) {
      bookmarkTitle = `
        <form class="js-edit-bookmark">
          <input class="bookmark-bookmark type="text" value="${bookmark.title}" />
        </form>
      `;
    }
  
    return `
      <li class="js-bookmark-element" data-bookmark-id="${bookmark.id}">
        ${bookmarkTitle}
        <div class="bookmark-bookmark-controls">
          </button>
        </div>
      </li>`;
  }
  

  function generateBookmarkString(bookmarkApp) {
    const bookmarks = bookmarkApp.map((bookmark) => generateBookmarkElement(bookmark));
    return bookmarks.join('');
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
    let bookmarks = [...store.bookmarks ];

    //Filter list to only show bookmarks with rating >= minimumrating
    if (store.minumRating > 0) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minimumRating);
    }
    
    // show console that render has run, gen a bookListBookmarksString
    console.log('`render` ran');
    const bookmarkListStrings = generateBookmarkString(bookmarks);
      
    // insert that HTML string into the DOM
    $('.bookmarks-list').html(bookmarkListStrings);
  }

  function handleToggleNewBookmarkForm () {
    // change 'js-bookmark-app-form' to show new input buttons
    // the toggle function should handle the "add new" and "cancel" once
    // the form has changed
    $('newBookmark').click(() => {
      store.toggleNewBookmarkForm();
      render();
    });
  }

  function handleNewBookmarkSubmit() {
    $('#js-bookmark-app-form').submit(function (event) {
      event.preventDefault();
      const newBookmark = $('#js-bookmark-app-form').serializeJson();
      console.log(newBookmark);
      event.target.reset;
      api.createBookmark(newBookmark)
        .then((response) => {
          if (response.ok){
            return response.json();
          }
        })
        .then(bookmark => {
          store.addBookmark(bookmark);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  }
  
  function getBookmarkIdFromElement(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  }


  function handleBookmarkDetailClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-toggle', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      api.updateBookmark(id, { isDetailedView: !bookmark.isDetailedView })
        .then(() => {
          store.findAndUpdate(id, { isDetailedView: !bookmark.isDetailedView });
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        }
        );
    });
  }

  function handleDeleteBookmarkClicked() {
    $('.js-bookmark-list').on('click,', '.js-bookmark-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      
      api.deleteBookmark(id)
        .then (() => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          console.log(err);
          store.setError(err.message);
          renderError();
        }
        );
    });
  }




  function bindEventListeners() {
    handleNewBookmarkSubmit();
    handleToggleNewBookmarkForm ();
    handleBookmarkDetailClicked();
    handleDeleteBookmarkClicked();
  }

  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };
}());
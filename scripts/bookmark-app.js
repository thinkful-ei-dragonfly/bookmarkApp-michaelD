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
  // Generate strings to show rating of each bookmark
  function generateRatingString(rating) {
    if (rating === 5) {
      return '5 STARS';
    } else if (rating === 4) {
      return '4 STARS';
    } else if (rating === 3) {
      return '3 STARS';
    } else if (rating === 2) {
      return '2 STARS';
    } else if (rating === 1) {
      return '1 STAR';
    } else { return 'NO STARS :_(';
    } 
  }

  // Generate HTML to populate the store area
  function generateBookmarkElement(bookmark) {

    /*    
    use ternary 
    ( conditional ?(TRUE) do this :(ELSE)  do that )
    to create a list of bookmarks that are HIGHER than minumumRating
    decide whether the bookmark isDetailedView or NOT   
    */

    const shownClass = (bookmark.rating < store.minimumRating) ? 'hidden' : '';

    let bookmarkInfo = '';
    if (bookmark.isDetailedView) {
      bookmarkInfo = `
                <div>
                    <p class="bookmark-description">${bookmark.desc}</p>
                    <a href=${bookmark.url}><button>Visit Site</button></a>
                    <button class="js-bookmark-delete">Delete</button>
                </div>
                `;
    } else {
      bookmarkInfo = `
      <button class="more-info">More Info</button>
      `;
    }
        
    if (bookmark.rating < store.minimumRating) {
      return `
      `;
    } 
        
    return `
        <li class="bookmark js-bookmark ${shownClass}" data-item-id="${bookmark.id}">
        <p class="bookmark-title">${bookmark.title}</p>
            <div class="rating">
                ${generateRatingString(bookmark.rating)}
            </div>
            ${bookmarkInfo}
        </li>
        `;
        
  }
  
  // Generate array of strings from the bookmarks
  // this CALLS bookmarkApp itself so it should create
  // some nice HTML to throw into the DOM
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


  // render the form so that it doesnt have to live in index.html
  // literlly copy and paste the string literal from index.html
  function renderForm() {
    let bookmarkHTML = '';
    bookmarkHTML =  `
      <div class="left">
      <label for="title">Title: </label>
      <input type="text" name="title" id="js-title-input" placeholder="title">
      <label for="url">URL: </label>
      <input type="url" name="url" id="js-url-input" placeholder="http://www.google.com">
      <label for="description">Description: </label>
      <input type="text" name="desc" id="js-description-input">
    </div>

    <div class="right">
      <input type="radio" name="rating" value="5" id="starRating-5">
      <label for="StarRating-5"> 5 Stars </label>
      <input type="radio" name="rating" value="4" id="starRating-4">
      <label for="StarRating-4"> 4 Stars </label>
      <input type="radio" name="rating" value="3" id="starRating-3">
      <label for="StarRating-3"> 3 Stars </label>
      <input type="radio" name="rating" value="2" id="starRating-2">
      <label for="StarRating-2"> 2 Stars </label>
      <input type="radio" name="rating" value="1" id="starRating-1">
      <label for="StarRating-1"> 1 Stars </label>
    </div>
    <button type="submit">Submit</button>

    </form>
            `;

    $('#js-bookmark-app-form').html(bookmarkHTML);
  }

  /*  FINISH LATER -toggle form show

--- handle the toggle to show / hide the entry fields
  function handleToggleNewBookmarkForm() {
    $('#js-bookmark-app-form').on('click', '.js-toggle-bookmark' , event => {
      store.toggleNewBookmarkForm();
      renderForm();
      render();
    });
  } */


  // this is to render the store seperately
  function render() {
    renderError();

    let bookmarks = [...store.bookmarks ];
    if (store.minumRating > 0) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.minimumRating);
    }
    console.log('`render` ran');
    const bookmarkListStrings = generateBookmarkString(bookmarks);
    // insert above HTML string into the DOM
    $('.js-bookmark-list').html(bookmarkListStrings);
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
      .closest('.bookmark')
      .data('item-id');
  }

  function handleDeleteButtonClicked() {
    $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
      let id = getBookmarkIdFromElement(event.currentTarget);
      console.log(id);
      api.deleteBookmark(id)
        .then(id => {
          store.findAndDelete(id);
          render();
        })
        .catch((err) => {
          store.setError(err.message);
          renderError();
        });
    });
  }

  function expandBookmark() {
    $('.js-bookmark-list').on('click', '.more-info', event => {
      let id = getBookmarkIdFromElement(event.currentTarget);
      console.log(`expanded ${id}`);
      const targetBookmark = store.findById(id);
      targetBookmark.isDetailedView = !targetBookmark.isDetailedView;
      render();
    });
  }

  const minimumChange= function() {
    $('#js-add-bookmark').on('change', 'select', (e) => {
      let filter = parseInt($(e.target).val());
      store.setMinRating(filter);
      render();
    });
  };


  function bindEventListeners() {
    renderForm();
    handleNewBookmarkSubmit();
    handleDeleteButtonClicked();
    expandBookmark();
    minimumChange();
  }

  return {
    renderForm,
    render,
    bindEventListeners,
  };
}());
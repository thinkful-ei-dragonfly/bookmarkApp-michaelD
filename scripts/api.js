'use strict';
// eslint-disable-next-line no-unused-vars
const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelD';

  let getItems = function() {
    return fetch(`${BASE_URL}/bookmarks`)
  }


  let createBookmark = function(bookmark) {
    return Promise.resolve(JSON.parse(bookmark));
  }

  return {
    getItems,
    createBookmark,
  };
}());

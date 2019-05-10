'use strict';
// eslint-disable-next-line no-unused-vars
const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelD';

  /**
   * listApiFetch - Wrapper function for native `fetch` to standardize error handling. 
   * @param {string} url 
   * @param {object} options 
   * @returns {Promise} - resolve on all 2xx responses with JSON body
   *                    - reject on non-2xx and non-JSON response with 
   *                      Object { code: Number, message: String }
   */
  
  const listApiFetch = function(...args) {

    // ?? may not need to delcare error b/c initalized as null in store??
    let error;

    return fetch(...args)
      .then(res => {
        if (!res.ok) {
          // if response is NOT OK then build error object
          error = { code: res.status };

          // Check to see if response is json format
          // if not place statusText in error object and reject promise
          if(!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }
        // If we get to this part of the loop, we know the response is OK
        return res.json();
      })
      .then(data => {
      /* next, if error exists, place JSON message into error object
      and reject the Promise with the error object. 
      This error will land in the catch in index.js as each function
      below is called   */
        if(error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        // Now we can FINALLY return the json as a regular returned Promise
        return data;
      });
  };



  const getBookmarks = function() {
    return listApiFetch(`${BASE_URL}/bookmarks`);
  };


  const createBookmark = function(bookmark) {
    return fetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bookmark,
    }

    );
  };

  return {
    getBookmarks,
    createBookmark,
  };
}());

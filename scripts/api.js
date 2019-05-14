// eslint-disable-next-line no-unused-vars
const api = (function () {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelD/bookmarks';

  /**
   * listApiFetch - Wrapper function for native `fetch` to standardize error handling. 
   * @param {string} url 
   * @param {object} options 
   * @returns {Promise} - resolve on all 2xx responses with JSON body
   *                    - reject on non-2xx and non-JSON response with 
   *                      Object { code: Number, message: String }
   */

  const listApiFetch = function (...args) {
    // error must be defined here because we are using it only within the scope of 
    // listApiFetch. This function does not know that error is defined as null in store

    let error;
    return fetch(...args)

      // Always handle res first
      .then(res => {
        if (!res.ok) {

          // if response is NOT OK then build error object
          error = { code: res.status };

          // Check to see if response is json format
          // if not place statusText in error object and reject promise
          if (!res.headers.get('content-type').includes('json')) {
            error.message = res.statusText;
            return Promise.reject(error);
          }
        }
        // If we get to this part of the loop, we know the response is OK
        return res.json();
      })

    /* 
    next, if error exists, place JSON message into error objectand 
    reject the Promise with the error object. This error
    will land in the catch in index.js as each functionb elow is called  
    */

      .then(data => {

        if (error) {
          error.message = data.message;
          return Promise.reject(error);
        }

        // NOW we can FINALLY return the json as a regular returned Promise and 
        // be sure to close brackets and parenth after to complete listApiFetch
        // data;
        // });
        // };
        return data;
      });
  };

  const getBookmarks = function () {
    return listApiFetch(BASE_URL);
  };

  const createBookmark = function (bookmark) {
    return fetch(`${BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: bookmark,
    });
  };

  const deleteBookmark = function (id) {
    const options = {
      method: 'DELETE'
    };
    return listApiFetch(`${BASE_URL}/${id}`, options);
  };

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark
  };


}());
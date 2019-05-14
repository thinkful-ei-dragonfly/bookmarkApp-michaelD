// eslint-disable-next-line no-unused-vars
const store = (function () {
  const setError = function (error) {
    this.error = error;
  };

  const _toStore = function (bookmark) {
    return Object.assign(bookmark, { isDetailedView: false });
  };
  const addBookmark = function (bookmark) {
    this.bookmarks.push(_toStore(bookmark));
  };

  const toggleNewBookmarkForm = function () {
    this.newBookmarkForm = !this.newbookmarkForm;
  };

  const findById = function (id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function (id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const setMinRating = function (rating) {
    this.minimumRating = rating;
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
    setMinRating,
  };

}());



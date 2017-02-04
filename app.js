var app = (function () {
  var pixabayPublicKey = '4424166-feb46d87eba60cf69cbaa833f';

  function handleResponseData(responseData) {
    var photos = responseData.hits;
    var photo;
    var thumbnailsContainer = document.getElementById('thumbnails');

    for (var i = 0; i < photos.length; i++) {
      photo = photos[i];

      var photoFragment = document.createDocumentFragment();
      var thumbnail = document.createElement('div');
      var imgEl = document.createElement('img');
      thumbnail.className += 'grid__item col-1-8 flex ai--c';
      imgEl.src = photo.previewURL;

      photoFragment.appendChild(thumbnail);
      thumbnail.appendChild(imgEl);

      thumbnailsContainer.appendChild(photoFragment);
    }
  }

  function fetchPhotos() {
    var photoRequest = new XMLHttpRequest();
    var endpoint;
    var responseData;

    photoRequest.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          responseData = JSON.parse(this.responseText);
          handleResponseData(responseData);
        } else {
          // display error
        }
      }
    }

    endpoint = 'https://pixabay.com/api/?key=' + pixabayPublicKey;
    photoRequest.open('GET', endpoint);
    photoRequest.send();
  }

  function init() {
    fetchPhotos();
  }

  return {
    init: init,
  }
})();

app.init();

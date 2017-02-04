var app = (function () {
  var pixabayPublicKey = '4424166-feb46d87eba60cf69cbaa833f';
  var pageCounter = 1;
  var allPhotos = [];
  var currentExpandedPhotoIndex = 0;

  function expandImageByIndex(index) {
    currentExpandedPhotoIndex = index;
    var photoToExpand = allPhotos[index];
    var expandedPhotoContainer = document.getElementById('expandedPhotoContainer');
    var expandedPhotoFragment = document.createDocumentFragment();
    var expandedPhoto = document.createElement('div');
    var expandedImgEl = document.createElement('img');

    expandedPhotoContainer.className += ' overlay';
    expandedPhoto.className += 'position--fixed mt';
    expandedImgEl.src = photoToExpand.webformatURL;
    expandedImgEl.className += 'expanded--image';

    expandedPhoto.appendChild(expandedImgEl);
    expandedPhotoFragment.appendChild(expandedPhoto);

    expandedPhotoContainer.appendChild(expandedPhotoFragment);
  }

  function handleResponseData(responseData) {
    var photos = responseData.hits;
    var photo;
    var thumbnailsContainer = document.getElementById('thumbnails');
    var currentPhotosLength = allPhotos.length;

    for (var i = 0; i < photos.length; i++) {
      photo = photos[i];
      allPhotos.push(photo);

      var photoFragment = document.createDocumentFragment();
      var thumbnail = document.createElement('div');
      var imgEl = document.createElement('img');
      thumbnail.className += 'grid__item col-1-8 flex ai--c';
      imgEl.src = photo.previewURL;
      imgEl.className += 'thumbnail--image'

      imgEl.addEventListener('click', expandImageByIndex.bind(this, currentPhotosLength + i));

      thumbnail.appendChild(imgEl);
      photoFragment.appendChild(thumbnail);

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

    endpoint = 'https://pixabay.com/api/?key=' + pixabayPublicKey + '&orientation=horizontal&per_page=50&page=' + pageCounter;
    photoRequest.open('GET', endpoint);
    photoRequest.send();
    pageCounter ++;
  }

  function init() {
    fetchPhotos();
  }

  return {
    init: init,
    fetchPhotos: fetchPhotos,
  }
})();

app.init();

var fetchMoreButton = document.getElementById('fetchMorePhotos');
fetchMoreButton.addEventListener('click', app.fetchPhotos);

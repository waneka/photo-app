var app = (function () {
  var pixabayPublicKey = '4424166-feb46d87eba60cf69cbaa833f';
  var pageCounter = 1;
  var allPhotos = [];
  var isPhotoExpanded = false;

  function expandImageByIndex(index) {
    setTimeout(function () {
      isPhotoExpanded = true;
    }, 10);
    // isPhotoExpanded = true;
    var photoToExpand = allPhotos[index];
    var expandedPhotoContainer = document.getElementById('expandedPhotoContainer');
    var expandedPhotoFragment = document.createDocumentFragment();
    var expandedPhoto = document.createElement('div');
    var expandedImgEl = document.createElement('img');
    var imageOverlay = document.createElement('div');
    var leftArrow = document.createElement('div');
    var rightArrow = document.createElement('div');

    expandedPhotoContainer.innerHTML = '';

    expandedPhotoContainer.className += ' overlay';
    expandedPhoto.className += 'position--fixed mt';
    expandedPhoto.id = 'expanded-photo';

    expandedImgEl.src = photoToExpand.webformatURL;
    expandedImgEl.className += 'expanded--image';

    imageOverlay.className += 'flex image--overlay';

    leftArrow.className += 'arrow--left';
    rightArrow.className += 'arrow--right';

    leftArrow.addEventListener('click', expandImageByIndex.bind(this, index - 1));
    rightArrow.addEventListener('click', expandImageByIndex.bind(this, index + 1));

    if (index > 0) {
      imageOverlay.appendChild(leftArrow);
    } else {
      imageOverlay.appendChild(document.createElement('div'));
    }

    if (index < allPhotos.length - 1) {
      imageOverlay.appendChild(rightArrow);
    } else {
      imageOverlay.appendChild(document.createElement('div'));
    }

    expandedPhoto.appendChild(expandedImgEl);
    expandedPhoto.appendChild(imageOverlay);

    expandedPhotoFragment.appendChild(expandedPhoto);

    expandedPhotoContainer.appendChild(expandedPhotoFragment);
  }

  function closeExpandedPhoto(e) {
    if (isPhotoExpanded && !e.target.closest('#expanded-photo')) {
      var expandedPhotoContainer = document.getElementById('expandedPhotoContainer');
      expandedPhotoContainer.innerHTML = '';
      expandedPhotoContainer.className = 'flex jc--c';
      isPhotoExpanded = false;
    }
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
    closeExpandedPhoto: closeExpandedPhoto,
  }
})();

app.init();

var fetchMoreButton = document.getElementById('fetchMorePhotos');
fetchMoreButton.addEventListener('click', app.fetchPhotos);

document.addEventListener('click', app.closeExpandedPhoto);

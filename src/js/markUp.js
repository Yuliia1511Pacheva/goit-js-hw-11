function createMarkup(arr) {
  return arr
    .map(
      ({
        downloads,
        comments,
        views,
        likes,
        tags,
        largeImageURL,
        webformatURL,
      }) => `
  <div class="photo-card">
  <a href="${largeImageURL}">
  <div class="photo-thumb">
  <img src="${webformatURL}" alt="${tags}" class="image" loading="lazy" />
  </div>
  </a>
   
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br>${likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>${downloads}
    </p>
  </div>
</div>
  `
    )
    .join('');
}

export {createMarkup}
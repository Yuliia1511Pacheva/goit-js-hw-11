import axios from 'axios';

async function getPhotos(query, page = 1) {
  const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '35795496-dc73936924deac0cc2e60d251';
    const per_page = 40;
  const params = new URLSearchParams({
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: per_page,
    page: page,
  });

    const response = await axios.get(`${BASE_URL}?${params}`);
    const { data } = response;
    return data;
  
}

export { getPhotos };

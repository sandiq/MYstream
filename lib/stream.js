export async function searchFilm(query, page = 1) {
  const response = { results: [] };

  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=true&language=en-US&page=${page}`;

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmQ4MDdmNzM1OGRjZWE4NTAyOTFkNzM3YWM0Mjg1MiIsIm5iZiI6MTcyMzIwNDQ0Ni4zODQ5NzksInN1YiI6IjY2ODI2ZDA5OWU1MThkYjA1YjFiNzVmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GuVTSK_Z-CWJOFalwiKu8-FzilqPIBROlQ71-eMBZz0',
      'Content-Type': 'application/json;charset=utf-8',
      'Referer': 'https://themoviedb.org/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  return data
}
export async function getGenresById(arr=[]) {
  let genres = []
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en-US`;

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MmQ4MDdmNzM1OGRjZWE4NTAyOTFkNzM3YWM0Mjg1MiIsIm5iZiI6MTcyMzIwNDQ0Ni4zODQ5NzksInN1YiI6IjY2ODI2ZDA5OWU1MThkYjA1YjFiNzVmNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GuVTSK_Z-CWJOFalwiKu8-FzilqPIBROlQ71-eMBZz0',
      'Content-Type': 'application/json;charset=utf-8',
      'Referer': 'https://themoviedb.org/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  for (let id of arr) {
    genres.push(data?.genres?.find(v => v?.id == id)?.name)
  }
  return genres?.join(' - ') || '-'
}
export async function filmInfo(id, type) {
  const url = `https://db.videasy.net/3/${type}/${id}?append_to_response=credits,external_ids,similar,videos,recommendations,translations,images&language=en`;

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Accept': 'application/json',
      'Referer': 'https://videasy.net/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  return data
}
export async function getMovies() {
  const url = `https://api.trakt.tv/movies/popular?limit=50`;

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://trakt.tv/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Trakt-Api-Key': '6f4a4cde281905ac5c7db1b8394094ef6133d6fe04e402313c104cfa5691a3f7',
      'Trakt-Api-Version': '2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  
  return data;
}
export async function getShows() {
  const url = `https://api.trakt.tv/shows/popular?limit=50`;

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://trakt.tv/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Trakt-Api-Key': '6f4a4cde281905ac5c7db1b8394094ef6133d6fe04e402313c104cfa5691a3f7',
      'Trakt-Api-Version': '2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  
  return data;
}
export async function getPopulate() {
  const url = `https://api.trakt.tv/movies/trending?limit=25`;
  let results = [];

  const fetchResponse = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://trakt.tv/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Trakt-Api-Key': '6f4a4cde281905ac5c7db1b8394094ef6133d6fe04e402313c104cfa5691a3f7',
      'Trakt-Api-Version': '2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data = await fetchResponse.json();
  
  data.map(v => {
    results.push(v)
  })
  
  const url2 = `https://api.trakt.tv/shows/trending?limit=25`;

  const fetchResponse2 = await fetch(url2, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Referer': 'https://trakt.tv/',
      'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
      'Sec-Ch-Ua-Mobile': '?1',
      'Sec-Ch-Ua-Platform': '"Android"',
      'Trakt-Api-Key': '6f4a4cde281905ac5c7db1b8394094ef6133d6fe04e402313c104cfa5691a3f7',
      'Trakt-Api-Version': '2',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  });

  const data2 = await fetchResponse2.json();
  
  data2.map(v => {
    results.push(v)
  })
  return results
}

/*
url_vidplus: `https://player.vidplus.to/embed/${res.media_type}/${res.id}?autoplay=true`,
      url_videasy: `https://player.videasy.net/${res.media_type}/${res.id}`,
      url_vidrock: `https://vidrock.net/${res.media_type}/${res.id}`,
      url_vidsrc: `https://vidsrc-embed.ru/embed/${res.media_type}/${res.id}`,
*/
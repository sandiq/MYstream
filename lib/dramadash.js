import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

const CONFIG = {
  BASE_URL: 'https://www.dramadash.app/api',
  HEADERS: {
    'app-version': '70',
    'lang': 'id',
    'platform': 'android',
    'tz': 'Asia/Jakarta',
    'device-type': 'phone',
    'content-type': 'application/json; charset=UTF-8',
    'user-agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
  }
};

let SESSION = {
  deviceId: null,
  token: null
};

const generateDeviceId = () => {
  return uuidv4().replace(/-/g, "").substring(0, 16);
};

const ensureAuth = async () => {
  if (SESSION.token) return SESSION.token;

  try {
    if (!SESSION.deviceId) SESSION.deviceId = generateDeviceId();
    
    const response = await axios.post(`${CONFIG.BASE_URL}/landing`, 
      { android_id: SESSION.deviceId },
      { headers: CONFIG.HEADERS }
    );

    if (response.data && response.data.token) {
      SESSION.token = response.data.token;
      return SESSION.token;
    } else {
      throw new Error('Gagal mendapatkan token akses');
    }
  } catch (error) {
    throw new Error(`Auth Error: ${error.message}`);
  }
};

const request = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = await ensureAuth();

    const headers = { 
      ...CONFIG.HEADERS,
      'authorization': `Bearer ${token}`
    };

    const config = {
      url: `${CONFIG.BASE_URL}/${endpoint}`,
      method,
      headers,
      data: data ? data : undefined
    };

    const response = await axios(config);
    return response.data;

  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw error;
  }
};

export const dramadash = {
  home: async () => {
    const res = await request('home');
    const { dramaList, bannerDramaList, trendingSearches, tabs } = res;

    const mapDrama = (item) => ({
      id: item.id,
      name: item.name,
      poster: item.poster,
      desc: item.desc || "",
      viewCount: item.viewCount || 0,
      tags: item.tags ? item.tags.map(t => t.displayName) : [],
      genres: item.genres ? item.genres.map(g => g.displayName) : []
    });

    const flatDramaList = dramaList
      .filter(item => Array.isArray(item.list))
      .flatMap(item => item.list);

    return {
      status: 200,
      data: {
        banner: bannerDramaList.list.map(mapDrama),
        trending: trendingSearches.map(item => ({
          id: item.id,
          name: item.name,
          poster: item.poster,
          genres: item.genres.map(g => g.displayName)
        })),
        drama: flatDramaList.map(mapDrama)
      },
      tabs
    };
  },

  tabs: async (tabId) => {
    if (!tabId) throw new Error("Tab ID wajib diisi");
    const res = await request(`home?tab_id=${tabId}`);
    const { list, tabs } = res;
    return {
      status: 200,
      list,
      tabs
    };
  },

  detail: async (dramaId) => {
    if (!dramaId) throw new Error("Drama ID wajib diisi");
    
    const response = await request(`drama/${dramaId}`);
    const { drama } = response;

    return {
      status: 200,
      data: {
        id: drama.id,
        name: drama.name,
        poster: drama.poster,
        description: drama.description,
      },
      episodes: drama.episodes.map(eps => eps.episodeNumber)
    };
  },

  search: async (query) => {
    if (!query) throw new Error("Query pencarian tidak boleh kosong");
    
    const { result } = await request('search/text', 'POST', { search: query });
    
    return {
      status: 200,
      data: result.map(item => ({
        id: item.id,
        name: item.name,
        poster: item.poster,
        genres: item.genres ? item.genres.map(g => g.displayName) : []
      })),
    };
  },

  episode: async (dramaId, epsNumber) => {
    if (!dramaId || !epsNumber) throw new Error("Drama ID dan Episode Number wajib diisi");
    
    const { episodes } = await dramadash.detail(dramaId);
    const episode = episodes.find(e => e.episodeNumber === parseInt(epsNumber));
    
    if (!episode) throw new Error(`Episode ${epsNumber} tidak ditemukan`);

    return {
      status: 200,
      data: episode
    };
  }
};
// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

import { ElMessage } from 'element-plus'
import { mockSongList } from './mockSongs.js'

// 获取音乐播放列表
export const getPlayerList = async (server = 'netease', type = 'playlist', id = '26177669') => {
  try {
    // 尝试使用网易云音乐API获取数据
    console.log('尝试从网易云音乐API获取歌单数据');
    
    // 使用Meting API获取网易云歌单数据
    const apiUrl = `https://api.injahow.cn/meting/?server=${server}&type=${type}&id=${id}`;
    const res = await fetch(apiUrl);
    const data = await res.json();
    
    console.log('API响应数据:', data);
    
    // 检查响应格式并处理
    if (Array.isArray(data) && data.length > 0) {
      // 转换数据格式
      const songList = data.map(item => ({
        name: item.name || item.title || '未知歌曲',
        artist: item.artist || item.author || '未知艺术家',
        url: item.url || `https://music.163.com/song/media/outer/url?id=${item.id || item.songid}.mp3`,
        cover: item.cover || item.pic || 'https://via.placeholder.com/150',
        lrc: item.lrc || item.lyric || '[00:00.00]暂无歌词'
      }));
      
      ElMessage({
        message: `成功获取网易云歌单，共${songList.length}首歌曲`,
        type: 'success'
      });
      
      return songList;
    } else {
      throw new Error('获取的歌单数据为空或格式不正确');
    }
  } catch (error) {
    console.error('获取网易云歌单失败:', error);
    
    // API调用失败时回退到模拟数据
    ElMessage({
      message: '网易云API访问失败，使用本地模拟数据',
      type: 'warning'
    });
    
    return mockSongList;
  }
};

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 获取高德地理天气信息
export const getWeather = async (key, city) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
  return await res.json();
};

// 获取教书先生天气 API
// https://api.oioweb.cn/doc/weather/GetWeather
export const getOtherWeather = async () => {
  const res = await fetch("https://api.oioweb.cn/api/weather/GetWeather");
  return await res.json();
};

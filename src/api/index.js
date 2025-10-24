// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

import { ElMessage } from 'element-plus'
import { mockSongList } from './mockSongs.js'

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  try {
    console.log('使用模拟音乐数据');
    
    // 直接返回模拟数据，跳过API调用
    ElMessage({
      message: '使用本地模拟音乐数据',
      type: 'info'
    });
    
    return mockSongList;
  } catch (error) {
    console.error('处理音乐数据时出错:', error);
    
    // 即使处理过程中出错也返回模拟数据
    ElMessage({
      message: '使用本地模拟数据',
      type: 'info'
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

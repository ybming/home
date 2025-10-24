// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 模拟歌曲数据，用于API调用失败时的备用
const mockSongs = [
  {
    title: "春天里",
    artist: "汪峰",
    src: "",
    pic: "",
    lrc: "[00:00.00]春天里 - 汪峰\n[00:10.00]还记得许多年前的春天\n[00:14.00]那时的我还没剪去长发\n[00:18.00]没有信用卡也没有她\n[00:22.00]没有24小时热水的家\n[00:26.00]可当初的我是那么快乐\n"
  },
  {
    title: "夜空中最亮的星",
    artist: "逃跑计划",
    src: "",
    pic: "",
    lrc: "[00:00.00]夜空中最亮的星 - 逃跑计划\n[00:12.00]夜空中最亮的星\n[00:16.00]能否听清\n[00:20.00]那仰望的人\n[00:24.00]心底的孤独和叹息\n"
  },
  {
    title: "起风了",
    artist: "买辣椒也用券",
    src: "",
    pic: "",
    lrc: "[00:00.00]起风了 - 买辣椒也用券\n[00:15.00]这一路上走走停停\n[00:18.00]顺着少年漂流的痕迹\n[00:22.00]迈出车站的前一刻\n[00:25.00]忽然不知要去哪里\n"
  }
];

// 获取音乐播放列表
export const getPlayerList = async (server, type, id) => {
  try {
    console.log(`尝试获取${server}${type === 'playlist' ? '歌单' : ''}数据，ID: ${id}`);
    
    // 使用一个更可靠的公开网易云音乐API代理服务
    const apiUrl = "https://api.i-meto.com/meting/api";
    
    // 添加超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    const res = await fetch(
      `${apiUrl}?server=${server}&type=${type}&id=${id}`,
      { 
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    clearTimeout(timeoutId); // 清除超时定时器
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const data = await res.json();
    
    // 验证响应数据
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("无效的音乐数据响应");
    }

    // 处理数据，确保每个字段都有值
    const processedData = data.map(item => ({
      title: item.title || "未知歌曲",
      artist: item.author || "未知艺术家",
      src: item.url || "",
      pic: item.pic || "",
      lrc: item.lrc || ""
    }));
    
    console.log("成功获取音乐数据:", processedData.length, "首歌曲");
    return processedData;
    
  } catch (error) {
    console.error("音乐API调用错误:", error.message);
    console.log("使用备用模拟数据");
    // 返回模拟数据作为备用
    return mockSongs;
  }
  
  // 原始代码已移除，现在直接使用上面的实现
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
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`
  );
  return await res.json();
};

/**
 * 获取配置
 */

// 获取社交链接
export const getSocialLinks = async () => {
  const res = await fetch("/socialLinks.json");
  return await res.json();
};

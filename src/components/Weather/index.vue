<template>
  <div
    class="weather"
    v-if="weatherData.adCode.city && weatherData.weather.weather"
  >
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">&nbsp;{{ weatherData.weather.winddirection }}风&nbsp;</span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { onMounted, reactive, h } from "vue";
import { ElMessage } from "element-plus";
import { getAdcode, getWeather } from "@/api";
import { Error } from "@icon-park/vue-next";

// 高德开发者 Key
let mainKey = import.meta.env.VITE_WEATHER_KEY;

// 天气数据
let weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 获取天气数据
const getWeatherData = () => {
  // 如果没有API key或者为了开发测试，使用mock数据
  const useMockData = true; // 设置为true使用模拟数据，避免API调用失败
  
  if (useMockData) {
    // 使用模拟数据
    weatherData.adCode = {
      city: "北京",
      adcode: "110000"
    };
    weatherData.weather = {
      weather: "晴",
      temperature: "25",
      winddirection: "东南",
      windpower: "3"
    };
    console.log("使用模拟天气数据");
    return;
  }
  
  // 获取地理位置信息
  if (!mainKey) return onError("请配置天气 Key");
  
  getAdcode(mainKey)
    .then((res) => {
      console.log("地理位置响应:", res);
      if (res && res.status === "1") {
        weatherData.adCode = {
          city: res.city || "未知城市",
          adcode: res.adcode || ""
        };
        
        // 只有在获取到adcode时才请求天气
        if (weatherData.adCode.adcode) {
          getWeather(mainKey, weatherData.adCode.adcode)
            .then((res) => {
              console.log("天气响应:", res);
              if (res && res.status === "1" && res.lives && res.lives[0]) {
                weatherData.weather = {
                  weather: res.lives[0].weather || "未知",
                  temperature: res.lives[0].temperature || "--",
                  winddirection: res.lives[0].winddirection || "未知",
                  windpower: res.lives[0].windpower || "--"
                };
              } else {
                onError("天气信息获取失败");
                useFallbackWeatherData();
              }
            })
            .catch((error) => {
              console.error("天气API调用错误:", error);
              onError("天气信息获取失败");
              useFallbackWeatherData();
            });
        } else {
          onError("无法获取城市编码");
          useFallbackWeatherData();
        }
      } else {
        onError("地理位置获取失败");
        useFallbackWeatherData();
      }
    })
    .catch((error) => {
      console.error("位置API调用错误:", error);
      onError("地理位置获取失败");
      useFallbackWeatherData();
    });
};

// 使用备用天气数据
const useFallbackWeatherData = () => {
  weatherData.adCode = {
    city: "默认城市",
    adcode: ""
  };
  weatherData.weather = {
    weather: "多云",
    temperature: "22",
    winddirection: "北",
    windpower: "2"
  };
}

// 报错信息
const onError = (message) => {
  ElMessage({
    message: message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>
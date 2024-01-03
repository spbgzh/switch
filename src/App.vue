<template>
  <v-chart
    class="chart"
    ref="chartRef"
    :option="chartOption"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
  ></v-chart>
</template>

<script setup lang="ts">
import { ECElementEvent } from "echarts/types/dist/echarts";
import { ref, onMounted, onUnmounted } from "vue";

import VChart from "vue-echarts";

const line1 = ref(0.1);
const line2 = ref(1.5);
const chartRef = ref<typeof VChart | null>(null);
const chartOption = ref({
  animation: false,
  grid: {
    top: 40,
    left: 50,
    right: 40,
    bottom: 50,
  },
  xAxis: {
    name: "Pressing Force (N)",
    nameLocation: "center",
    nameTextStyle: {
      padding: [10, 0, 0, 0],
    },
    min: 0,
    max: 50,
    minorTick: {
      show: true,
    },
    splitLine: {
      lineStyle: {
        color: "#999",
      },
    },
    minorSplitLine: {
      show: true,
      lineStyle: {
        color: "#ddd",
      },
    },
  },
  yAxis: {
    name: "Pressing Distance (mm)",
    nameLocation: "center",

    nameTextStyle: {
      padding: [0, 0, 5, 0],
    },
    min: 0,
    max: 4,
    minorTick: {
      show: true,
    },
    splitLine: {
      lineStyle: {
        color: "#999",
      },
    },
    minorSplitLine: {
      show: true,
      lineStyle: {
        color: "#ddd",
      },
    },
  },

  series: [
    {
      data: [1, 2],
      type: "line",
      markLine: {
        symbol: "none",
        animation: false,
        lineStyle: {
          type: "solid",
          width: 3,
          shadowBlur: 10,
          oopacity: 0.8,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
        emphasis: {
          lineStyle: {
            width: 4,
            shadowBlur: 10,
            opacity: 0.9,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
        data: [
          {
            name: "2",
            yAxis: line1,
          },
        ],
        silent: false,
      },
    },
    {
      data: [],
      type: "line",
      markLine: {
        symbol: "none",
        animation: false,
        lineStyle: {
          color: "red",
          type: "solid",
          width: 3,
          shadowBlur: 10,
          opacity: 0.8,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
        emphasis: {
          lineStyle: {
            width: 4,
            shadowBlur: 10,
            opacity: 0.9,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
        data: [
          {
            name: "2",
            yAxis: line2,
          },
        ],
        silent: false,
      },
    },
  ],
});

let isDragging = false;

function onMouseDown(params: ECElementEvent) {
  isDragging = true;
  updateLine1(params);
}

function onMouseMove(params: ECElementEvent) {
  if (isDragging) {
    updateLine1(params);
  }
}

function onMouseUp() {
  isDragging = false;
}

function updateLine1(params: ECElementEvent) {
  if (isDragging && chartRef.value) {
    const rect = chartRef.value.getDom().getBoundingClientRect();
    const x = params.clientX - rect.left;
    const y = params.clientY - rect.top;
    const pixelPoint: [number, number] = [x, y];
    const dataPoint = chartRef.value.convertFromPixel(
      { seriesIndex: 0 },
      pixelPoint
    );
    if (dataPoint) {
      line1.value = dataPoint[1]; // 假设 Y 轴是我们需要更新的
    }
  }
}

onMounted(() => {
  const chartDom = chartRef.value?.getDom();
  chartDom?.addEventListener("mousemove", onMouseMove);
  chartDom?.addEventListener("mousedown", onMouseDown);
  window.addEventListener("mouseup", onMouseUp);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", onMouseUp);
});
</script>

<style scoped>
.chart {
  height: 500px;
  width: 500px;
}
</style>

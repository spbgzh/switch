<template>
  <div @contextmenu.prevent="handleRightClick">
    <v-chart
      class="chart"
      ref="chartRef"
      :option="chartOption"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    ></v-chart>
  </div>
</template>

<script setup lang="ts">
import { ECElementEvent } from "echarts/types/dist/echarts";
import { ref, onMounted, onUnmounted } from "vue";

import VChart from "vue-echarts";

const line1 = ref(0.1);
const line2 = ref(1.5);
const data = [
  [19.392, 0.0128],
  [24.234, 0.0578],
  [27.206, 0.4376],
  [29.582, 0.7567],
  [30.753, 1.0303],
  [33.157, 1.1669],
  [39.807, 1.2725],
  [45.856, 1.3478],
  [48.265, 1.454],
  [45.826, 1.5455],
  [40.966, 1.6222],
  [35.496, 1.7293],
  [28.81, 1.8519],
  [22.13, 1.944],
  [20.904, 2.0354],
  [23.92, 2.1262],
  [31.785, 2.2165],
  [42.681, 2.3064],
  [51.756, 2.4117],
  [54.77, 2.5178],
  [55.339, 2.761],
  [56.515, 3.0042],
  [58.296, 3.2474],
  [60, 3.5057],
];

const chartRef = ref<typeof VChart | null>(null);
const draggingLine = ref<String | null>(null);
const chartOption = ref({
  animation: false,
  tooltip: {
    show: true,
    trigger: "axis",
    axisPointer: {
      type: "cross",
      snap: true,
    },
  },
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
    max: 60,
    minorTick: {
      show: true,
      splitNumber: 10,
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
      splitNumber: 10,
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
      data: data,
      type: "line",
      smooth: true, // 开启平滑曲线
    },
    {
      data: [],
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
        label: {
          show: true,
          formatter: "Press Trigger: {c} mm",
          position: "middle",
          fontSize: 14,
          color: "rgba(143, 200, 115, 1)",
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
            name: "Line 1",
            yAxis: line1,
            id: "1",
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
          opacity: 0.7,
          shadowColor: "rgba(0, 0, 0, 0.2)",
        },
        label: {
          show: true,
          formatter: "Lift Trigger: {c} mm",
          position: "middle",
          fontSize: 14,
          color: "red",
        },
        emphasis: {
          lineStyle: {
            width: 4,
            shadowBlur: 10,
            opacity: 0.8,
            shadowColor: "rgba(0, 0, 0, 0.3)",
          },
        },
        data: [
          {
            name: "Line 2",
            yAxis: line2,
            id: "2",
          },
        ],
        silent: false,
      },
    },
  ],
});
let isDragging = false;

function onMouseDown(params: ECElementEvent) {
  if (params.componentType === "markLine" && params.data.id) {
    draggingLine.value = params.data.id;
    isDragging = true;
  }
}

function onMouseMove(event: MouseEvent) {
  if (isDragging && chartRef.value) {
    const rect = chartRef.value.getDom().getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const pixelPoint: [number, number] = [x, y];
    const dataPoint = chartRef.value.convertFromPixel(
      { seriesIndex: 0 },
      pixelPoint
    );

    if (dataPoint && dataPoint[0]) {
      let newYValue = Math.round(dataPoint[1] * 10) / 10;
      newYValue = Math.min(4, Math.max(0, newYValue));

      if (draggingLine.value === "1") {
        line1.value = newYValue;
      } else if (draggingLine.value === "2") {
        line2.value = newYValue;
      }
    }
  }
}

function onMouseUp() {}
function handleRightClick() {}

function onMouseClick(event: MouseEvent) {
  if (!isDragging) {
    const x = event.clientX;
    const y = event.clientY;
    const pixelPoint: [number, number] = [x, y];
    const dataPoint = chartRef.value?.convertFromPixel(
      { seriesIndex: 0 },
      pixelPoint
    );
    if (dataPoint) {
      dataPoint[0] = Math.round(dataPoint[0] * 10) / 10;
      if (dataPoint[0] < 0) {
        dataPoint[0] = 0;
      }
      if (dataPoint[0] > 60) {
        dataPoint[0] = 60;
      }
      dataPoint[1] = Math.round(dataPoint[1] * 10) / 10;
      if (dataPoint[1] < 0) {
        dataPoint[1] = 0;
      }
      if (dataPoint[1] > 4) {
        dataPoint[1] = 4;
      }
      let insertIndex = data.length;
      for (let i = 0; i < data.length; i++) {
        if (data[i][1] >= dataPoint[1]) {
          insertIndex = i;
          break;
        }
      }

      data.splice(insertIndex, 0, dataPoint);

      chartRef.value?.setOption({
        series: [
          {
            data: data,
          },
        ],
      });
    }
  }

  isDragging = false;
  draggingLine.value = null;
}

function onRightClick(params: ECElementEvent) {
  debugger;
  if (!isDragging) {
    const x = params.clientX;
    const y = params.clientY;
    const pixelPoint: [number, number] = [x, y];
    const dataPoint = chartRef.value?.convertFromPixel(
      { seriesIndex: 0 },
      pixelPoint
    );
    if (dataPoint) {
      if (data.length == 0) {
        return;
      } else if (data.length == 1) {
        data.pop();
      } else if (data.length > 1) {
        let popIndex = 0;
        let min = Math.abs(data[0][1] - dataPoint[1]);
        for (let i = 1; i < data.length; i++) {
          let temp =
            Math.abs(data[i][0] - dataPoint[0]) +
            Math.abs(data[i][1] - dataPoint[1]);
          if (temp < min) {
            min = temp;
            popIndex = i;
          }
        }
        data.splice(popIndex, 1);
      }
      chartRef.value?.setOption({
        series: [
          {
            data: data,
          },
        ],
      });
    }
  }
}

onMounted(() => {
  const chartDom = chartRef.value?.getDom();
  chartDom?.addEventListener("mousemove", onMouseMove);
  chartDom?.addEventListener("click", onMouseClick);
  chartDom?.addEventListener("contextmenu", onRightClick);
  window.addEventListener("mouseup", onMouseUp);
});

onUnmounted(() => {
  window.removeEventListener("mouseup", onMouseUp);
});
</script>

<style scoped>
.chart {
  height: 600px;
  width: 600px;
}
</style>

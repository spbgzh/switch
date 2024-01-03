import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import "echarts";
import VueECharts from "vue-echarts";

const app = createApp(App);
app.component("v-chart", VueECharts).mount("#app");

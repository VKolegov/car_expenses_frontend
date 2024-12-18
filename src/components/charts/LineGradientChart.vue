<script setup>
import { computed } from 'vue';

import { Line } from 'vue-chartjs';
import { max, min } from 'lodash';

import { fontSize } from '@/responsiveness.js';

const props = defineProps({
  title: {
    type: String,
    default: 'Line Gradient Chart',
  },
  yLabels: {
    type: Array,
    required: true,
  },
  yValues: {
    type: Array,
    required: true,
  },
  tickFormatter: {
    type: Function,
    default: (value, index, ticks) => value,
  },
});

const data = computed(() => ({
  labels: props.yLabels,
  datasets: [
    {
      label: props.title,
      data: props.yValues,
      borderColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }
        return getGradient(ctx, chartArea);
      },
    }],
}));

const options = {
  responsive: true,
  scales: {
    y: {
      suggestedMin: min(props.yValues) * 0.5,
      suggestedMax: max(props.yValues) * 1.3,
      ticks: {
        callback: props.tickFormatter,
      },
    },
  },
  tension: 0.2,

  plugins: {
    datalabels: {
      align: 'top',
      font: {
        size: fontSize,
        weight: '500',
        family: 'Inter',
      },
      formatter: props.tickFormatter,
    },
    legend: {
      display: false,
      labels: {
        boxWidth: 0,
        boxHeight: 0,
      },
    },
  },
};

let width, height, gradient;

function getGradient (ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'red');
  }

  return gradient;
}

</script>

<template>
  <Line
      v-if="yLabels.length && yValues.length"
      :data="data"
      :options="options"
  />
</template>

<style scoped>

</style>
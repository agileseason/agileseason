<template>
  <Modal class='modal-chart'>
    <Tabs
      :items='tabs'
      :active='activeTab'
    />
    <div class='body'>
      <VueApexCharts
        type='bar'
        height='500'
        :options='chartOptions'
        :series='series'
      />
      <!--div class='issues'>
        <h2>Issues</h2>
      </div-->
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/modal.vue';
import Tabs from '@/components/tabs/tabs';

import VueApexCharts from 'vue3-apexcharts';
import { get } from 'vuex-pathify';

export default {
  components: {
    Modal,
    Tabs,
    VueApexCharts
  },
  data: () => ({
    tabs: [
      'Age of issues'
    ],
    activeTab: 'Age of issues'
  }),
  computed: {
    columns: get('board/columns'),
    boardId() { return parseInt(this.$route.params.id); },
    series() {
      return [{
        name: 'Age',
        data: this.chartData
      }];
    },
    chartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: { show: false },
          animations: { speed: 400 }
        },
        dataLabels: { enabled: false },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '85%',
            endingShape: 'rounded'
          },
        },
        colors: [
          ({ value }) => {
            const base = 7;
            if (value < base) { return '#64dd17'; }
            else if (value < base * 2) { return '#00c853'; }
            else if (value < base * 3) { return '#ffd600'; }
            else if (value < base * 4) { return '#ff6d00'; }
            else if (value < base * 5) { return '#dd2c00'; }
            else { return '#b71c1c'; }
          }
        ],
        xaxis: {
          categories: this.chartCategories,
        },
        yaxis: {
          title: { text: 'Days' }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: { formatter: (val) => (`${val} days`) }
        }
      };
    },
    chartData() {
      return this.issues.map(v => v.ageDays);
    },
    chartCategories() {
      return this.issues.map(v => `${v.number}`);
    },
    issues() {
      return this.columns.flat()
        .map(v => v.issues)
        .flat()
        .sort((a, b) => (a.ageDays <= b.ageDays) ? 1 : -1)
    }
  }
}
</script>

<style scoped lang='sass'>
.modal-chart
  max-width: 80%

  .body
    padding: 10px 14px

  .tabs
    background-color: #e8eaf6
</style>

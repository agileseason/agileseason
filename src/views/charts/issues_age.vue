<template>
  <Modal class='modal-chart'>
    <Tabs
      :items='tabs'
      :active='activeTab'
    />
    <div class='body'>
      <VueApexCharts
        type='bar'
        height='600'
        :options='chartOptions'
        :series='series'
        @click='clickByBar'
      />
      <div class='issues' style='color: #888'>
        <h2>TODO</h2>
        <ul>
          <li>Legend</li>
          <li>List of issues</li>
        </ul>
      </div>
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
    activeTab: 'Age of issues',
    isVisible: true,
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
            if (value < base * 2) { return '#64dd17'; }
            else if (value < base * 4) { return '#00c853'; }
            else if (value < base * 8) { return '#ffd600'; }
            else if (value < base * 16) { return '#ff6d00'; }
            else if (value < base * 32) { return '#dd2c00'; }
            else { return '#b71c1c'; }
          }
        ],
        xaxis: { categories: this.chartCategories, },
        yaxis: { title: { text: 'Days in progress' } },
        fill: { opacity: 1 },
        tooltip: {
          y: { formatter: (val) => (`${val} days`) }
        }
      };
    },
    chartData() {
      return this.issues.map(v => v.ageDays);
    },
    chartCategories() {
      return this.issues.map(v => `#${v.number}`);
    },
    issues() {
      return this.columns.flat()
        .map(v => v.issues.filter(i => i.isClosed === false))
        .flat()
        .sort((a, b) => (a.ageDays <= b.ageDays) ? 1 : -1)
    }
  },
  methods: {
    clickByBar(event, chartContext, config) {
      const index = config.dataPointIndex;
      if (index < 0) { return; }

      const issue = this.issues[index];
      if (issue == null) { return; }

      this.isVisible = false;
      this.$nextTick(() => {
        this.$router.push({
          name: 'issue',
          params: { issueId: issue.id, issueNumber: issue.number }
        });
      });
    }
  }
}
</script>

<style scoped lang='sass'>
.modal-chart
  max-width: 90%
  width: 90%

  .body
    padding: 10px 14px

  .tabs
    // background-color: #e8eaf6
    // border-bottom: 1px solid #c5cae9
</style>

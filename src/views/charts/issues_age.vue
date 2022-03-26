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
      <div class='issues'>
        <div class='row header'>
          <div>Issue</div>
          <div>Age (days)</div>
        </div>
        <div v-for='issue in issues' class='row issue' :key='issue.id' @click='clickByRow(issue)'>
          <div>
            <div class='title'>{{ issue.title }}</div>
            <div class='url'>
              <span class='number'>
                #{{ issue.number }}
                {{ issue.repositoryName }}
              </span>
              opened on
              {{ openedOnFormat(issue) }}
              by
              {{ issue.author.login }}
            </div>
          </div>
          <div>{{ issue.ageDays }}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from '@/components/modal.vue';
import Tabs from '@/components/tabs/tabs';

import VueApexCharts from 'vue3-apexcharts';
import { get } from 'vuex-pathify';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

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
            else if (value < base * 32) { return '#ff3d00'; }
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
    },
    clickByRow({ id, number }) {
      this.$nextTick(() => {
        this.$router.push({
          name: 'issue',
          params: { issueId: id, issueNumber: number }
        });
      });
    },
    openedOnFormat({ createdAt }) {
      const date = new Date(createdAt);
      return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    }
  }
}
</script>

<style scoped lang='sass'>
.modal-chart
  max-width: 90%
  width: 90%

  .body
    max-height: calc(100vh - 106px)
    overflow-y: scroll
    padding: 10px 14px

  .tabs
    // background-color: #e8eaf6
    // border-bottom: 1px solid #c5cae9

.issues
  .row
    display: grid
    grid-template-columns: auto auto
    justify-content: space-between
    grid-gap: 10px
    padding: 8px 0
    align-items: top
    border-bottom: 1px solid #e8eaf6

    &.header
      font-weight: 300
      letter-spacing: 1px
      text-transform: uppercase

    &.issue
      cursor: pointer

      &:hover
        background-color: rgba(232, 234, 246, 0.6)

  .title
    color: #212121
    font-size: 15px
    font-weight: 500
    line-height: 18px
    word-break: break-word
    margin-bottom: 2px

  .url
    color: #757575
    font-weight: 300
    font-size: 12px

    .number
      color: #616161
      font-weight: 400
</style>

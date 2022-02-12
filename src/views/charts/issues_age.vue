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

    series: [{
      name: 'Age',
      data: [200, 199, 150, 90, 50, 40, 30, 26, 20, 15, 10, 4, 1]
    // }, {
    //   name: 'Revenue',
    //   data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    // }, {
    //   name: 'Free Cash Flow',
    //   data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
    chartOptions: {
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
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['#1', '#3', '#10', '#19', '#20', '#22', '#24', '#26', '#28', '#30', '#40', '#41', '#44'],
      },
      yaxis: {
        title: { text: 'Days' }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return `${val} days`;
          }
        }
      }
    }
  }),
  computed: {
    // currentIssue: get('board/currentIssue'),
    // issueModalStyle: get('user/issueModalStyle'),
    boardId() { return parseInt(this.$route.params.id); },
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

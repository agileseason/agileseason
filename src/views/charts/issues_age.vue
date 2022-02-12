<template>
  <Modal class='modal-chart'>
    <VueApexCharts
      type='bar'
      height='500'
      :options='chartOptions'
      :series='series'
    />
  </Modal>
</template>

<script>
import Modal from '@/components/modal.vue';

import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    VueApexCharts,
    Modal
  },
  data: () => ({
    series: [{
      name: 'Age',
      data: [200, 199, 150, 90, 50, 40, 30, 26, 20, 5, 4, 1, 1]
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
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '85%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
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
</style>

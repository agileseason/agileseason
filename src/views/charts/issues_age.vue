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
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
    chartOptions: {
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
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
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
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

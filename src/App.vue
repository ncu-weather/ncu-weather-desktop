<template>
<div id="app">
  <h1>中大即時氣象</h1>
  <button :disabled="loading" @click="refresh()">重新整理</button>
  <p>體感溫度：{{ apparentTemperature }}&deg;C</p>
  <p>現在溫度：{{ wt.temperature }}&deg;C</p>
  <p>目前降雨：{{ wt.precip }} mm/hr</p>
  <h2>天氣預報</h2>
  <!-- <img src="http://pblap.atm.ncu.edu.tw/getchart.asp?img=NCU&id=1027482187"> -->
  <iframe src="http://pblap.atm.ncu.edu.tw/ncuobs/plotsta72T_track.asp" width="595"></iframe>
  <p>資料來源：國立中央大學─大氣科學系─大氣邊界層暨空氣污染實驗室</p>
</div>
</template>

<script>
const loadingStr = 'Loading...'
export default {
  name: 'app',
  data () {
    return {
      wt: {
        temperature: loadingStr,
        precip: loadingStr
      },
      loading: true
    }
  },
  created () {
    // this.getNcu()
    this.getNcuAtm()
  },
  computed: {
    apparentTemperature () {
      let waterPressure = (this.wt.relativeHumidity / 100) * 6.105 * Math.exp((17.27 * this.wt.temperature) / (237.7 + this.wt.temperature))
      let t = (1.04 * this.wt.temperature) + (0.2 * waterPressure) - (0.65 * this.wt.windSpeed) - 2.7
      if (isNaN(t)) {
        return loadingStr
      } else {
        return t.toFixed(1)
      }
    }
  },
  methods: {
    getNcu() {
      this.$http.get('https://ncu.herokuapp.com/ncu')
        .then( response => {
          this.wt = response.data
          this.loading = false
        })
        .catch( error => {
          console.log(error)
        })
    },
    getNcuAtm() {
      this.$http.get('https://ncu.herokuapp.com/ncuatm')
        .then( response => {
          this.wt = response.data
          this.loading = false
        })
        .catch( error => {
          console.log(error)
        })
    },
    refresh() {
      this.wt.temperature = loadingStr
      this.wt.precip = loadingStr
      this.loading = true
      this.getNcuAtm()
    }
  }
}
</script>

<style>
</style>

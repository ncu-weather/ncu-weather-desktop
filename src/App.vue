<template>
<div id="app">
  <md-toolbar>
    <h1 class="md-title" style="flex: 1">中大即時氣象</h1>
    <md-button class="md-icon-button" 
        :disabled="loading" @click.native="refresh()"
      >
      <md-icon>refresh</md-icon>
    </md-button>
  </md-toolbar>

  <div id="progress-bar">
    <md-progress class="md-accent" md-indeterminate
      v-show="loading"
    ></md-progress>
  </div>

  <md-list>
    <md-list-item>
      <md-icon>cloud_queue</md-icon>
      <span>體感溫度：{{ apparentTemperature }}&deg;C</span>
      <md-spinner :md-size="30" md-indeterminate class="md-accent" v-show="loading"></md-spinner>
    </md-list-item>
    <md-list-item>
      <md-icon>cloud</md-icon>
      <span>現在溫度：{{ wt.temperature }}&deg;C</span>
      <md-spinner :md-size="30" md-indeterminate class="md-accent" v-show="loading"></md-spinner>
    </md-list-item>
    <md-list-item>
      <md-icon>grain</md-icon>
      <span>目前降雨：{{ wt.precip }} mm/hr</span>
      <md-spinner :md-size="30" md-indeterminate class="md-accent" v-show="loading"></md-spinner>
    </md-list-item>
  </md-list>

  <md-card>
    <md-card-header>
      <div class="md-title">
        天氣預報
        <a href="http://pblap.atm.ncu.edu.tw" target="_blank"><md-icon class="md-accent">link</md-icon></a>
      </div>
      <div class="md-subhead">資料來源：http://pblap.atm.ncu.edu.tw</div>
    </md-card-header>
    <md-card-media>
        <iframe src="http://pblap.atm.ncu.edu.tw/ncuobs/plotsta72T_track.asp" width="600"></iframe>
    </md-card-media>
    <md-card-content>
      <h3 class="md-subheading">Powered by 國立中央大學─大氣科學系─大氣邊界層暨空氣污染實驗室</h3>
    </md-card-content>
  </md-card>
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
          this.loading = false
          this.wt = response.data
        })
        .catch( error => {
          console.log(error)
        })
    },
    getNcuAtm() {
      this.$http.get('https://ncu.herokuapp.com/ncuatm')
        .then( response => {
          this.loading = false
          this.wt = response.data
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
#progress-bar {
  height: 5px;
}
</style>

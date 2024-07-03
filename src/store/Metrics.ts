import axios from "axios"
import { makeAutoObservable } from "mobx"
import { team } from "./Team"

class Metrics {
   metrics: any[]

   constructor() {
      this.metrics = []
      makeAutoObservable(this)
   }

   async getMetrics() {
      const res = await callGetMetrics()
      let result: any[] = []
      for (let i of res.data) {
         const data = await callGetMetricsData(i.id, i.aggregationType)
         result = [...result, { metric: i, data: data.data }]
      }
      this.metrics = result
   }
}

async function callGetMetrics() {
   try {
      return await axios.get('https://api.ilert.com/api/metrics', { headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id } })
   } catch (err) {
      throw console.error(err)
   }
}

async function callGetMetricsData(metricId: number, aggregation: string) {
   try {
      const start = Math.floor(Date.now() / 1000)
      const oneMonthInMilliseconds = 28 * 24 * 60 * 60
      const end = start - oneMonthInMilliseconds;

      return await axios.get(`https://assessment.ilert.com/api/metrics/${metricId}/series`, {
         headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id }, params: {
            aggregation,
            'interval-sec': 7200,
            from: end,
            until: start,
            interpolate: true
         }
      })
   } catch (err) {
      throw console.error(err)
   }
}

export const metrics = new Metrics()

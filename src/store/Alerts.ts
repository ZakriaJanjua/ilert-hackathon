import axios from "axios"
import { makeAutoObservable } from "mobx"
import { team } from "./Team"

class Alerts {
   pending: number
   accepted: number

   constructor() {
      this.pending = 0
      this.accepted = 0
      makeAutoObservable(this)
   }

   async getPendingAlerts() {
      const res = await callGetAlerts('PENDING')
      this.pending = res.data.count
   }

   async getAcceptedAlerts() {
      const res = await callGetAlerts('ACCEPTED')
      this.accepted = res.data.count
   }
}

async function callGetAlerts(status: string) {
   try {
      return await axios.get('https://api.ilert.com/api/alerts/count', { headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id }, params: { states: status } })
   } catch (err) {
      throw console.error(err)
   }
}

export const alerts = new Alerts()
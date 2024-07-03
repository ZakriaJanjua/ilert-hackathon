import axios from "axios"
import { makeAutoObservable } from "mobx"
import { team } from "./Team"

class RecentLogEntries {
   entries: any[]

   constructor() {
      this.entries = []
      makeAutoObservable(this)
   }

   async getRecentLogEntries() {
      const res = await callGetRecentLogEntries()
      this.entries = res.data
   }
}

async function callGetRecentLogEntries() {
   try {
      return await axios.get('https://api.ilert.com/api/alerts/newest-log-entries?include=alert&include=vars&include=textPlain', { headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id } })
   } catch (err) {
      throw console.error(err)
   }
}

export const recentLogEntries = new RecentLogEntries()
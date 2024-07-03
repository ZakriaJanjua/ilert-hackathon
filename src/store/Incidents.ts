import axios from "axios"
import { makeAutoObservable } from "mobx"
import { team } from "./Team"

class Incidents {
   incidents: any[]

   constructor() {
      this.incidents = []
      makeAutoObservable(this)
   }

   async getIncidents() {
      const res = await callGetIncidents()
      this.incidents = res.data
   }
}

async function callGetIncidents() {
   try {
      return await axios.get('https://assessment.ilert.com/api/incidents', { headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id } })
   } catch (err) {
      throw console.error(err)
   }
}

export const incidents = new Incidents()

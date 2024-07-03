import axios from "axios"
import { makeAutoObservable } from "mobx"
import { team } from "./Team"

class Services {
   services: any[]

   constructor() {
      this.services = []
      makeAutoObservable(this)
   }

   async getServices() {
      const res = await callGetServices()
      this.services = res.data
   }
}

async function callGetServices() {
   try {
      return await axios.get('https://api.ilert.com/api/services', { headers: { Authorization: import.meta.env.VITE_API_KEY, 'Team-Context': team.selectedTeam.id } })
   } catch (err) {
      throw console.error(err)
   }
}

export const services = new Services()
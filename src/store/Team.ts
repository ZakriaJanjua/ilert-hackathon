import { makeAutoObservable } from 'mobx'
import axios from 'axios'

class Team {
   teams: any[];
   selectedTeam: any

   constructor() {
      this.teams = []
      this.selectedTeam = { id: 0, name: 'All Teams' }
      makeAutoObservable(this)
   }

   async getTeams() {
      const res = await callGetTeams()
      this.teams = [{ id: 0, name: 'All Teams' }, { id: -1, name: 'My Teams' }, ...res.data]
   }

   selectTeam(team: any) {
      this.selectedTeam = team
   }

}

async function callGetTeams() {
   try {
      return await axios.get('https://api.ilert.com/api/teams', { headers: { Authorization: import.meta.env.VITE_API_KEY } })
   } catch (err) {
      throw console.error(err)
   }
}

export const team = new Team()


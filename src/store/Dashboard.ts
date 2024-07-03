import axios from "axios"
import { makeAutoObservable } from "mobx"

class Dashboard {
   layout: any

   constructor() {
      this.layout = {}
      makeAutoObservable(this)
   }

   async getLayout() {
      const res = await callGetLayout()
      this.layout = res.data
   }

   async putLayout(body: any) {
      const res = await callPutLayout(body)
      this.layout = res.data
      window.location.reload()
   }
}

async function callGetLayout() {
   try {
      return await axios.get('https://api.ilert.com/api/v1/user-view-preferences/DASHBOARD', { headers: { Authorization: import.meta.env.VITE_API_KEY } })
   } catch (err) {
      throw console.error(err)
   }
}

async function callPutLayout(body: any) {
   try {
      return await axios.put('https://api.ilert.com/api/v1/user-view-preferences/DASHBOARD', { ...body }, { headers: { Authorization: import.meta.env.VITE_API_KEY } })
   } catch (err) {
      throw console.error(err)
   }
}

export const dashboard = new Dashboard()

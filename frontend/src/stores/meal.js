import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useMealStore = defineStore('meal', () => {
  const mealEntries = ref([])
  const stats = ref({
    theo: { gamelle: 0, rie: 0, tickets: 0 },
    lucas: { gamelle: 0, rie: 0, tickets: 0 }
  })
  const currentMonth = ref(new Date())
  const loading = ref(false)

  const year = computed(() => currentMonth.value.getFullYear())
  const month = computed(() => currentMonth.value.getMonth() + 1)

  async function fetchMonth(date = currentMonth.value) {
    loading.value = true
    try {
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      
      const response = await axios.get(`${API_URL}/api/meal-entries`, {
        params: { year: y, month: m }
      })
      
      mealEntries.value = response.data
      await fetchStats(date)
    } catch (error) {
      console.error('Erreur lors de la récupération des entrées:', error)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats(date = currentMonth.value) {
    try {
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      
      const response = await axios.get(`${API_URL}/api/meal-entries/stats`, {
        params: { year: y, month: m }
      })
      
      stats.value = response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error)
    }
  }

  function updateStatsLocally() {
    const year = currentMonth.value.getFullYear()
    const month = currentMonth.value.getMonth() + 1
    
    const result = {
      theo: { gamelle: 0, rie: 0, tickets: 0 },
      lucas: { gamelle: 0, rie: 0, tickets: 0 }
    }
    
    mealEntries.value.forEach(entry => {
      const entryDate = new Date(entry.date)
      if (entryDate.getFullYear() === year && entryDate.getMonth() + 1 === month) {
        if (entry.status === 'gamelle') {
          result[entry.person].gamelle++
          result[entry.person].tickets++
        } else if (entry.status === 'rie') {
          result[entry.person].rie++
        }
      }
    })
    
    stats.value = result
  }

  async function toggleMeal(date, person) {
    try {
      console.log('🔄 Toggle appelé:', { date, person })
      
      // Requête API d'abord
      const response = await axios.post(`${API_URL}/api/meal-entries`, {
        date: date,
        person: person
      })
      
      console.log('📥 Réponse API:', response.data, 'Status:', response.status)
      
      // Mise à jour de l'interface avec la réponse de l'API
      const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
      
      if (response.data) {
        console.log('✅ API a retourné une entrée:', response.data)
        // L'API a retourné une entrée (créée ou modifiée)
        const existingIndex = mealEntries.value.findIndex(
          e => e.date && e.date.split('T')[0] === dateStr && e.person === person
        )
        
        console.log('🔍 Index existant:', existingIndex)
        
        if (existingIndex >= 0) {
          mealEntries.value[existingIndex] = response.data
          console.log('🔄 Entrée mise à jour')
        } else {
          mealEntries.value.push(response.data)
          console.log('➕ Entrée ajoutée')
        }
      } else if (response.status === 204) {
        console.log('🗑️ API a supprimé l\'entrée (204)')
        // L'API a supprimé l'entrée
        const existingIndex = mealEntries.value.findIndex(
          e => e.date && e.date.split('T')[0] === dateStr && e.person === person
        )
        
        if (existingIndex >= 0) {
          mealEntries.value.splice(existingIndex, 1)
          console.log('🗑️ Entrée supprimée de l\'interface')
        }
      }
      
      console.log('📊 Données après mise à jour:', mealEntries.value)
      
      // Recalculer les stats
      updateStatsLocally()
    } catch (error) {
      console.error('Erreur lors de la modification de l\'entrée:', error)
      // En cas d'erreur, recharger tout pour être sûr
      await fetchMonth()
      throw error
    }
  }

  function getEntryStatus(date, person) {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    
    return mealEntries.value.find(
      e => e.date && e.date.split('T')[0] === dateStr && e.person === person
    )?.status || null
  }

  function setCurrentMonth(date) {
    currentMonth.value = date
    fetchMonth(date)
  }

  function previousMonth() {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentMonth(newDate)
  }

  function nextMonth() {
    const newDate = new Date(currentMonth.value)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentMonth(newDate)
  }

  return {
    mealEntries,
    stats,
    currentMonth,
    loading,
    year,
    month,
    fetchMonth,
    fetchStats,
    toggleMeal,
    getEntryStatus,
    setCurrentMonth,
    previousMonth,
    nextMonth
  }
})


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
    // Mise à jour optimiste IMMÉDIATE de l'interface
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0]
    const existingIndex = mealEntries.value.findIndex(
      e => e.date && e.date.split('T')[0] === dateStr && e.person === person
    )
    
    // Calculer le nouveau status localement
    let newStatus = null
    if (existingIndex >= 0) {
      const currentStatus = mealEntries.value[existingIndex].status
      if (currentStatus === null) {
        newStatus = 'gamelle'
      } else if (currentStatus === 'gamelle') {
        newStatus = 'rie'
      } else {
        newStatus = null // sera supprimé
      }
    } else {
      newStatus = 'gamelle'
    }
    
    // Mise à jour immédiate de l'interface
    if (newStatus === null) {
      if (existingIndex >= 0) {
        mealEntries.value.splice(existingIndex, 1)
      }
    } else {
      const newEntry = {
        user_id: 1, // temporaire, sera remplacé par la vraie réponse
        date: dateStr,
        person: person,
        status: newStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      if (existingIndex >= 0) {
        mealEntries.value[existingIndex] = newEntry
      } else {
        mealEntries.value.push(newEntry)
      }
    }
    
    // Mise à jour immédiate des stats
    updateStatsLocally()
    
    try {
      // Requête API en arrière-plan
      const response = await axios.post(`${API_URL}/api/meal-entries`, {
        date: date,
        person: person
      })
      
      // Remplacer l'entrée temporaire par la vraie réponse
      if (response.data) {
        const finalIndex = mealEntries.value.findIndex(
          e => e.date && e.date.split('T')[0] === dateStr && e.person === person
        )
        if (finalIndex >= 0) {
          mealEntries.value[finalIndex] = response.data
        } else {
          // Ajouter si pas trouvé
          mealEntries.value.push(response.data)
        }
      } else if (response.status === 204) {
        // Supprimer seulement si l'API a explicitement retourné 204 (suppression)
        const finalIndex = mealEntries.value.findIndex(
          e => e.date && e.date.split('T')[0] === dateStr && e.person === person
        )
        if (finalIndex >= 0) {
          mealEntries.value.splice(finalIndex, 1)
        }
      }
      
      // Recalculer les stats avec les vraies données
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


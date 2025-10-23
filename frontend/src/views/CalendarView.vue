<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <CalendarHeader
        :current-month="mealStore.currentMonth"
        @previous-month="mealStore.previousMonth"
        @next-month="mealStore.nextMonth"
        @logout="handleLogout"
      />

      <StatsSummary :stats="mealStore.stats" />

      <CalendarGrid
        :current-month="mealStore.currentMonth"
        :get-entry-status="mealStore.getEntryStatus"
        @toggle-meal="handleToggleMeal"
      />

      <div v-if="mealStore.loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg">
          <p class="text-lg">Chargement...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMealStore } from '../stores/meal'
import CalendarHeader from '../components/CalendarHeader.vue'
import StatsSummary from '../components/StatsSummary.vue'
import CalendarGrid from '../components/CalendarGrid.vue'

const router = useRouter()
const authStore = useAuthStore()
const mealStore = useMealStore()

onMounted(async () => {
  await mealStore.fetchMonth()
})

async function handleToggleMeal(date, person) {
  try {
    await mealStore.toggleMeal(date, person)
  } catch (error) {
    console.error('Erreur lors du toggle:', error)
    alert('Erreur lors de la mise à jour')
  }
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>


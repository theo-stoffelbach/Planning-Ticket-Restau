<template>
  <div class="bg-white shadow-md rounded-lg p-6 mb-6">
    <div class="flex items-center justify-between mb-4">
      <button
        @click="emit('previous-month')"
        class="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold text-gray-800">
        {{ monthName }} {{ year }}
      </h2>

      <button
        @click="emit('next-month')"
        class="p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div class="flex justify-center items-center space-x-4">
      <button
        @click="emit('logout')"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Déconnexion
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentMonth: {
    type: Date,
    required: true
  }
})

const emit = defineEmits(['previous-month', 'next-month', 'logout'])

const monthNames = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
]

const monthName = computed(() => monthNames[props.currentMonth.getMonth()])
const year = computed(() => props.currentMonth.getFullYear())
</script>


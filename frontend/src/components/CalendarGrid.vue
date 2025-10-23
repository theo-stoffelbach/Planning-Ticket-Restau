<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="grid grid-cols-7 gap-2 mb-2">
      <div
        v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
        :key="day"
        class="text-center font-bold text-gray-700 text-sm py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2">
      <div
        v-for="blank in startBlanks"
        :key="`blank-${blank}`"
        class="h-24"
      />

      <DayCell
        v-for="day in daysInMonth"
        :key="day"
        :day="day"
        :date="getDate(day)"
        :theo-status="getStatus(day, 'theo')"
        :lucas-status="getStatus(day, 'lucas')"
        @toggle="(person) => handleToggle(day, person)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DayCell from './DayCell.vue'

const props = defineProps({
  currentMonth: {
    type: Date,
    required: true
  },
  getEntryStatus: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['toggle-meal'])

const year = computed(() => props.currentMonth.getFullYear())
const month = computed(() => props.currentMonth.getMonth())

const daysInMonth = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate()
})

const startBlanks = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  // Convertir Dimanche (0) à 7
  return firstDay === 0 ? 6 : firstDay - 1
})

function getDate(day) {
  return new Date(year.value, month.value, day)
}

function getStatus(day, person) {
  const date = getDate(day)
  return props.getEntryStatus(date, person)
}

function handleToggle(day, person) {
  const date = getDate(day)
  const dateStr = date.toISOString().split('T')[0]
  emit('toggle-meal', dateStr, person)
}
</script>


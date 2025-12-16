<template>
  <div class="bg-white shadow-md rounded-lg p-6" @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
    <div class="grid grid-cols-7 gap-2 mb-2">
      <div
        v-for="day in ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']"
        :key="day"
        class="text-center font-bold text-gray-700 text-sm py-2"
      >
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-2 select-none">
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
        :is-dragging="isDragging"
        :drag-person="dragPerson"
        :is-selected="isSelected(day)"
        @toggle="(person) => handleToggle(day, person)"
        @drag-start="(person) => handleDragStart(day, person)"
        @drag-enter="(person) => handleDragEnter(day, person)"
      />
    </div>

    <!-- Indicateur de sélection -->
    <div v-if="isDragging && selectedDays.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
      <span class="font-semibold">{{ dragPerson === 'theo' ? 'Théo' : 'Lucas' }}</span> -
      {{ selectedDays.length }} jour(s) sélectionné(s) →
      <span class="font-semibold">{{ nextStatusLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const emit = defineEmits(['toggle-meal', 'bulk-update'])

// Drag state
const isDragging = ref(false)
const dragPerson = ref(null)
const dragStartStatus = ref(null)
const selectedDays = ref([])

const year = computed(() => props.currentMonth.getFullYear())
const month = computed(() => props.currentMonth.getMonth())

const daysInMonth = computed(() => {
  return new Date(year.value, month.value + 1, 0).getDate()
})

const startBlanks = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay()
  return firstDay === 0 ? 6 : firstDay - 1
})

const nextStatus = computed(() => {
  if (dragStartStatus.value === null) return 'gamelle'
  if (dragStartStatus.value === 'gamelle') return 'rie'
  if (dragStartStatus.value === 'rie') return 'none'
  return 'gamelle'
})

const nextStatusLabel = computed(() => {
  if (nextStatus.value === 'gamelle') return '🍱 Gamelle'
  if (nextStatus.value === 'rie') return '🏢 RIE'
  return '❌ Aucun'
})

function getDate(day) {
  return new Date(year.value, month.value, day)
}

function getStatus(day, person) {
  const date = getDate(day)
  return props.getEntryStatus(date, person)
}

function isWeekend(day) {
  const date = getDate(day)
  const dayOfWeek = date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function isSelected(day) {
  return selectedDays.value.includes(day)
}

function handleToggle(day, person) {
  if (!isDragging.value) {
    const date = getDate(day)
    const dateStr = date.toISOString().split('T')[0]
    emit('toggle-meal', dateStr, person)
  }
}

function handleDragStart(day, person) {
  if (isWeekend(day)) return

  isDragging.value = true
  dragPerson.value = person
  dragStartStatus.value = getStatus(day, person)
  selectedDays.value = [day]
}

function handleDragEnter(day, person) {
  if (!isDragging.value) return
  if (person !== dragPerson.value) return
  if (isWeekend(day)) return

  if (!selectedDays.value.includes(day)) {
    selectedDays.value.push(day)
  }
}

function handleMouseUp() {
  if (!isDragging.value) return

  if (selectedDays.value.length > 0) {
    const dates = selectedDays.value.map(day => {
      const date = getDate(day)
      return date.toISOString().split('T')[0]
    })

    emit('bulk-update', dates, dragPerson.value, nextStatus.value)
  }

  // Reset drag state
  isDragging.value = false
  dragPerson.value = null
  dragStartStatus.value = null
  selectedDays.value = []
}

// Global mouseup listener pour gérer le cas où on relâche en dehors
function handleGlobalMouseUp() {
  handleMouseUp()
}

onMounted(() => {
  window.addEventListener('mouseup', handleGlobalMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mouseup', handleGlobalMouseUp)
})
</script>

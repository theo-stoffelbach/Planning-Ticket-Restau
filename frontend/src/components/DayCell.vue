<template>
  <div
    class="border rounded-lg overflow-hidden"
    :class="{
      'bg-gray-100': isWeekend,
      'bg-white': !isWeekend
    }"
  >
    <div class="text-center text-sm font-semibold py-1 border-b bg-gray-50">
      {{ day }}
    </div>
    
    <div class="grid grid-cols-2 divide-x h-24">
      <!-- Théo -->
      <button
        @click="handleClick('theo')"
        :disabled="isWeekend"
        class="flex flex-col items-center justify-center p-2 transition hover:bg-blue-50 disabled:cursor-not-allowed"
        :class="{
          'bg-green-100': theoStatus === 'gamelle',
          'bg-orange-100': theoStatus === 'rie'
        }"
      >
        <span class="text-xs font-semibold text-gray-600 mb-1">Théo</span>
        <span v-if="theoStatus === 'gamelle'" class="text-2xl">🍱</span>
        <span v-else-if="theoStatus === 'rie'" class="text-2xl">🏢</span>
        <span v-else class="text-gray-300 text-xs">-</span>
      </button>

      <!-- Lucas -->
      <button
        @click="handleClick('lucas')"
        :disabled="isWeekend"
        class="flex flex-col items-center justify-center p-2 transition hover:bg-purple-50 disabled:cursor-not-allowed"
        :class="{
          'bg-green-100': lucasStatus === 'gamelle',
          'bg-orange-100': lucasStatus === 'rie'
        }"
      >
        <span class="text-xs font-semibold text-gray-600 mb-1">Lucas</span>
        <span v-if="lucasStatus === 'gamelle'" class="text-2xl">🍱</span>
        <span v-else-if="lucasStatus === 'rie'" class="text-2xl">🏢</span>
        <span v-else class="text-gray-300 text-xs">-</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  day: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  theoStatus: {
    type: String,
    default: null
  },
  lucasStatus: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['toggle'])

const isWeekend = computed(() => {
  const dayOfWeek = props.date.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6 // Dimanche ou Samedi
})

function handleClick(person) {
  if (!isWeekend.value) {
    emit('toggle', person)
  }
}
</script>


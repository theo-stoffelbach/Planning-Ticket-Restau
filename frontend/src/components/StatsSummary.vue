<template>
  <div class="bg-white shadow-md rounded-lg p-6 mb-6">
    <h3 class="text-xl font-bold text-gray-800 mb-4">Statistiques du mois</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border-2 border-blue-200 rounded-lg p-4">
        <h4 class="text-lg font-semibold text-blue-800 mb-3">Théo</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">🍱 Gamelle:</span>
            <span class="font-bold text-green-600">{{ stats.theo.gamelle }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">🏢 RIE:</span>
            <span class="font-bold text-orange-600">{{ stats.theo.rie }}</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="text-gray-800 font-semibold">🎫 Tickets:</span>
            <span class="font-bold text-blue-600 text-xl">{{ stats.theo.tickets }}</span>
          </div>
        </div>
      </div>

      <div class="border-2 border-purple-200 rounded-lg p-4">
        <h4 class="text-lg font-semibold text-purple-800 mb-3">Lucas</h4>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-600">🍱 Gamelle:</span>
            <span class="font-bold text-green-600">{{ stats.lucas.gamelle }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">🏢 RIE:</span>
            <span class="font-bold text-orange-600">{{ stats.lucas.rie }}</span>
          </div>
          <div class="flex justify-between border-t pt-2">
            <span class="text-gray-800 font-semibold">🎫 Tickets:</span>
            <span class="font-bold text-purple-600 text-xl">{{ stats.lucas.tickets }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true
  }
})
</script>


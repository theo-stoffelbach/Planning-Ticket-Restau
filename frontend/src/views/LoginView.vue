<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Connexion
      </h2>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="votre@email.com"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Pas encore de compte ?
          <RouterLink to="/register" class="text-blue-600 hover:text-blue-800 font-semibold">
            S'inscrire
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  const result = await authStore.login(email.value, password.value)

  if (result.success) {
    router.push('/calendar')
  } else {
    error.value = result.errors?.email?.[0] || result.errors?.general?.[0] || 'Erreur de connexion'
  }

  loading.value = false
}
</script>


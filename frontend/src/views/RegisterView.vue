<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
        Inscription
      </h2>

      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Nom
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Votre nom"
          />
        </div>

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

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Mot de passe
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password_confirmation">
            Confirmer le mot de passe
          </label>
          <input
            id="password_confirmation"
            v-model="passwordConfirmation"
            type="password"
            required
            minlength="8"
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
          {{ loading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Déjà un compte ?
          <RouterLink to="/login" class="text-blue-600 hover:text-blue-800 font-semibold">
            Se connecter
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

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const loading = ref(false)
const error = ref(null)

async function handleRegister() {
  loading.value = true
  error.value = null

  if (password.value !== passwordConfirmation.value) {
    error.value = 'Les mots de passe ne correspondent pas'
    loading.value = false
    return
  }

  const result = await authStore.register(
    name.value,
    email.value,
    password.value,
    passwordConfirmation.value
  )

  if (result.success) {
    router.push('/calendar')
  } else {
    const errors = result.errors
    error.value = errors?.email?.[0] || errors?.password?.[0] || errors?.general?.[0] || 'Erreur d\'inscription'
  }

  loading.value = false
}
</script>


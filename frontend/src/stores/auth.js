import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  async function fetchCsrfCookie() {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`)
  }

  async function register(name, email, password, passwordConfirmation) {
    try {
      await fetchCsrfCookie()
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })

      user.value = response.data.user
      return { success: true }
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { general: [error.message] }
      }
    }
  }

  async function login(email, password) {
    try {
      await fetchCsrfCookie()
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      })

      user.value = response.data.user
      return { success: true }
    } catch (error) {
      return {
        success: false,
        errors: error.response?.data?.errors || { general: [error.message] }
      }
    }
  }

  async function logout() {
    try {
      await axios.post(`${API_URL}/api/logout`)
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      user.value = null
    }
  }

  async function checkAuth() {
    try {
      const response = await axios.get(`${API_URL}/api/user`)
      user.value = response.data
      return true
    } catch (error) {
      user.value = null
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth
  }
})

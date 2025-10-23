import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)

  function setAuthHeader() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  async function register(name, email, password, passwordConfirmation) {
    try {
      const response = await axios.post(`${API_URL}/api/register`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      
      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      setAuthHeader()
      
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
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password
      })
      
      user.value = response.data.user
      token.value = response.data.token
      localStorage.setItem('token', token.value)
      setAuthHeader()
      
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
      token.value = null
      localStorage.removeItem('token')
      setAuthHeader()
    }
  }

  async function checkAuth() {
    if (token.value) {
      setAuthHeader()
      try {
        const response = await axios.get(`${API_URL}/api/user`)
        user.value = response.data
        return true
      } catch (error) {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        setAuthHeader()
        return false
      }
    }
    return false
  }

  // Initialiser l'header au démarrage
  setAuthHeader()

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    checkAuth
  }
})


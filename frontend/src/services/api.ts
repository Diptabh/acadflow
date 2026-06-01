import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('acadflow_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('acadflow_token')
      localStorage.removeItem('acadflow_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (email: string, password: string, role: string) =>
    api.post('/auth/register', { email, password, role }),
  getMe: () => api.get('/auth/me'),
}

export const login = async (email: string, password: string) => {
  const response = await authApi.login(email, password)
  if (response.data.access_token) {
    localStorage.setItem('acadflow_token', response.data.access_token)
    localStorage.setItem('acadflow_user', JSON.stringify(response.data.user))
  }
  return response.data
}

export const logout = () => {
  localStorage.removeItem('acadflow_token')
  localStorage.removeItem('acadflow_user')
}

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('acadflow_user')
  return userStr ? JSON.parse(userStr) : null
}

export const getToken = () => localStorage.getItem('acadflow_token')

export default api

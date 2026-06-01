import api from './api'
import type { User, Student, Faculty, Subject } from '../types'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('acadflow_token')
    localStorage.removeItem('acadflow_user')
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('acadflow_user')
    return userStr ? JSON.parse(userStr) : null
  },

  getToken: (): string | null => {
    return localStorage.getItem('acadflow_token')
  },
}

export const studentService = {
  getAll: async (params?: { page?: number; page_size?: number }) => {
    const response = await api.get<{ data: Student[]; total: number }>('/students', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Student }>(`/students/${id}`)
    return response.data
  },

  create: async (data: Partial<Student>) => {
    const response = await api.post<{ data: Student }>('/students', data)
    return response.data
  },

  update: async (id: string, data: Partial<Student>) => {
    const response = await api.put<{ data: Student }>(`/students/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/students/${id}`)
  },
}

export const facultyService = {
  getAll: async (params?: { page?: number; page_size?: number }) => {
    const response = await api.get<{ data: Faculty[]; total: number }>('/faculty', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Faculty }>(`/faculty/${id}`)
    return response.data
  },

  create: async (data: Partial<Faculty>) => {
    const response = await api.post<{ data: Faculty }>('/faculty', data)
    return response.data
  },

  update: async (id: string, data: Partial<Faculty>) => {
    const response = await api.put<{ data: Faculty }>(`/faculty/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/faculty/${id}`)
  },
}

export const subjectService = {
  getAll: async (params?: { page?: number; page_size?: number }) => {
    const response = await api.get<{ data: Subject[]; total: number }>('/subjects', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get<{ data: Subject }>(`/subjects/${id}`)
    return response.data
  },

  getMySubjects: async () => {
    const response = await api.get<{ data: Subject[] }>('/subjects/my')
    return response.data
  },

  create: async (data: Partial<Subject>) => {
    const response = await api.post<{ data: Subject }>('/subjects', data)
    return response.data
  },

  update: async (id: string, data: Partial<Subject>) => {
    const response = await api.put<{ data: Subject }>(`/subjects/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    await api.delete(`/subjects/${id}`)
  },
}

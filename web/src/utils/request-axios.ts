import axios from 'axios'
import { useAuth } from '../contexts/auth'
import { useEffect } from 'react'

export function useAxios() {
  const { token, logout } = useAuth()

  useEffect(() => {
    // Adicionar o token a todas as requisições
    const requestInterceptor = axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Opcional: Interceptar respostas para tratar erros de autenticação
    const responseInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(requestInterceptor)
      axios.interceptors.response.eject(responseInterceptor)
    }
  }, [token, logout])

  return axios
}

import { ref } from 'vue'

export const user = ref(JSON.parse(localStorage.getItem('user')) || null)

export const setUser = (newUser) => {
  user.value = newUser
  localStorage.setItem('user', JSON.stringify(newUser))
}

export const clearUser = () => {
  user.value = null
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}
// Simple demo auth manager using localStorage
export function getBackendBase() {
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
}

export function getToken() {
  return localStorage.getItem('tg_token')
}

export function setToken(token) {
  localStorage.setItem('tg_token', token)
}

export function clearToken() {
  localStorage.removeItem('tg_token')
}

export async function quickRegister() {
  const backend = getBackendBase()
  const email = `demo${Date.now()}@trustguard.dev`
  const body = { email, password: 'Passw0rd!', name: 'Demo User' }
  const res = await fetch(`${backend}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const j = await res.json()
  if (!j.success) throw new Error(j.error || 'Register failed')
  setToken(j.data.token)
  return j.data
}

export async function getProfile() {
  const backend = getBackendBase()
  const token = getToken()
  if (!token) throw new Error('No token')
  const res = await fetch(`${backend}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const j = await res.json()
  if (!j.success) throw new Error(j.error || 'Profile failed')
  return j.data
}

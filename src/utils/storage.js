export function getItem(key) {
  try {
    const value = localStorage.getItem(key)
    return value !== null ? JSON.parse(value) : []
  } catch {
    return []
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`localStorage write failed for key "${key}"`)
  }
}

export function removeItem(key) {
  localStorage.removeItem(key)
}

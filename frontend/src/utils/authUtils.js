export const clearAuthData = () => {
  // Clear user data
  localStorage.removeItem('user')
  
  // Clear Firebase auth data
  localStorage.removeItem('firebase:host:number-ninja-game.firebaseapp.com')
  localStorage.removeItem('firebase:authUser:AIzaSyBillH69MnFOHHYypc94dgUAkxieeggvbM:[DEFAULT]')
  
  // Clear any other auth-related data
  const keys = Object.keys(localStorage)
  keys.forEach(key => {
    if (key.startsWith('firebase:')) {
      localStorage.removeItem(key)
    }
  })
  
  // Clear session storage
  sessionStorage.clear()
  
  // Clear cookies
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.split('=')
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  })
  
  console.log('All authentication data cleared')
} 
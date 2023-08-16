import { useEffect, useState } from 'react'

import moonIcon from '/images/moon.svg'
import sunIcon from '/images/sun.svg'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('')

  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? 'light')
  }, [])

  useEffect(() => {
    if (theme == 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button onClick={() => setTheme(theme == 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? <img src={moonIcon} alt="moon" /> : <img src={sunIcon} alt="sun" />}
    </button>
  )
}

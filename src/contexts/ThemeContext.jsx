import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove both to prevent conflicts
    root.classList.remove('light', 'dark');
    // Add the current theme
    root.classList.add(theme);
    // Save to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // We expose setTheme directly now instead of just 'toggleTheme'
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
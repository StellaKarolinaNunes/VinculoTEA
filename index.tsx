import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./styles/globals.css";
import "./styles/App.module.css";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { AccessibilityMenu } from './src/components/AccessibilityMenu/AccessibilityMenu';

import { ErrorBoundary } from './src/components/Erro/ErrorBoundary'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <AccessibilityProvider>
      <ErrorBoundary>
        <App />
        <AccessibilityMenu />
      </ErrorBoundary>
      <SpeedInsights />
    </AccessibilityProvider>
  </StrictMode>
)

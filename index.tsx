import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./styles/globals.css";
import "./styles/App.module.css";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { AccessibilityProvider } from './src/contexts/AccessibilityContext';
import { AccessibilityMenu } from './src/components/AccessibilityMenu/AccessibilityMenu';

import { ErrorBoundary } from './src/components/Erro/ErrorBoundary'
import { NotificationProvider } from './src/contexts/NotificationContext';

import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <NotificationProvider>
          <ErrorBoundary>
            <App />
            <AccessibilityMenu />
          </ErrorBoundary>
        </NotificationProvider>
        <SpeedInsights />
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>
)

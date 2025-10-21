// PrimeReact imports MUST come before other CSS
import 'primereact/resources/themes/lara-light-teal/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

// Import our custom styles
import './styles/variables.css';
import './styles/themes/light.css';
import './styles/themes/dark.css';
import './index.css';

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

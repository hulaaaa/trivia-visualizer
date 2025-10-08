import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/base.css';
import './styles/layout.css';
import './styles/controls.css';
import './styles/charts.css';
import './styles/cards.css';
import '@jetbrains/ring-ui-built/components/style.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
  </>,
)

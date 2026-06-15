import './style.css';
import './components.css';
import { initAiAssistants } from './aiAssistants.js';
import { initSalesSystem } from './salesSystem.js';
import { initHermesOS } from './hermesOS.js';

// 1. Sidebar Tab switching logic
const navItems = document.querySelectorAll('.nav-item');
const tabPanes = document.querySelectorAll('.tab-pane');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const targetTabId = item.getAttribute('data-tab');
    
    navItems.forEach(n => n.classList.remove('active'));
    tabPanes.forEach(p => p.classList.remove('active'));
    
    item.classList.add('active');
    const targetPane = document.getElementById(targetTabId);
    if (targetPane) targetPane.classList.add('active');
  });
});

// 2. Update current system time dynamically
const timeEl = document.getElementById('current-time');
if (timeEl) {
  const updateSystemTime = () => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    timeEl.textContent = formatted;
  };
  updateSystemTime();
  setInterval(updateSystemTime, 1000);
}

// 3. ntfy Logger Utility
const ntfyLogger = document.getElementById('ntfy-logger');
const btnClearTerminal = document.getElementById('btn-clear-terminal');

export const logNtfy = (level, message) => {
  if (!ntfyLogger) return;
  const time = new Date();
  const timestamp = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
  
  let cssClass = 'info';
  if (level === 'Tehlike' || level === 'ALARM') cssClass = 'danger';
  if (level === 'Uyarı') cssClass = 'warning';

  const entry = document.createElement('div');
  entry.className = `alert-log-entry ${cssClass}`;
  entry.innerHTML = `[${level}] ${timestamp} - ${message}`;
  
  ntfyLogger.appendChild(entry);
  ntfyLogger.scrollTop = ntfyLogger.scrollHeight;
};

if (btnClearTerminal) {
  btnClearTerminal.addEventListener('click', () => {
    if (ntfyLogger) ntfyLogger.innerHTML = '';
  });
}

// 4. Initialize Modular Subsystems
document.addEventListener('DOMContentLoaded', () => {
  initAiAssistants();
  initSalesSystem();
  initHermesOS();
});


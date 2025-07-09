import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { supabase } from './supabaseClient';

function logPageView() {
  const page = window.location.pathname;
  const userAgent = navigator.userAgent;
  // IP address is not available client-side, leave null
  supabase.from('analytics_events').insert([
    { event_type: 'page_view', page, user_agent: userAgent }
  ]);
}

window.addEventListener('DOMContentLoaded', logPageView);
window.addEventListener('popstate', logPageView);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 
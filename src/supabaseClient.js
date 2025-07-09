import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ardnhnxyvyebezfjwpgn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyZG5obnh5dnllYmV6Zmp3cGduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MzgzOTksImV4cCI6MjA2NzMxNDM5OX0.NowR2BzqfRAOtQ6gLNJ5lQIGNpy9ZOz1Zq1ayu40cos';

// Configure Supabase client with optimal settings for real-time updates
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      // Prevent caching of API responses for real-time data
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }
}); 
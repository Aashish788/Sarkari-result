import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import QuickLinks from './components/QuickLinks';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import PWAInstallButton from './components/PWAInstallButton';
import PWAStatus from './components/PWAStatus';
import { supabase } from './supabaseClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import JobDetails from './components/JobDetails';
import ResultDetails from './components/ResultDetails';
import AdmitCardDetails from './components/AdmitCardDetails';
import AnswerKeyDetails from './components/AnswerKeyDetails';
import AdmissionDetails from './components/AdmissionDetails';
import DocumentDetails from './components/DocumentDetails';
import './App.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { checkForUpdates } from './utils/versionCheck';

function RequireAuth({ children }) {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    let timeoutId;
    let mounted = true;

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
        setSession(null);
      }
    }, 5000); // 5 second timeout

    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!mounted) return;

        if (!currentSession) {
          setSession(null);
          setLoading(false);
          return;
        }

        // Get profile in parallel with session check
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();

        if (!mounted) return;

        if (profileError) {
          console.error('Profile check error:', profileError);
          setSession(null);
          setIsAdmin(false);
        } else {
          setSession(currentSession);
          setIsAdmin(profile?.role === 'admin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Start auth check immediately
    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      if (!currentSession) {
        setSession(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();

        if (!mounted) return;

        if (profileError) {
          throw profileError;
        }

        setSession(currentSession);
        setIsAdmin(profile?.role === 'admin');
      } catch (error) {
        console.error('Profile check error:', error);
        if (mounted) {
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [loading]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#f4f4f4' 
      }}>
        <div style={{ 
          background: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(44,62,80,0.10)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>Loading...</h2>
          <p style={{ color: '#7f8c8d' }}>Please wait while we verify your credentials.</p>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #3498db',
            borderRadius: '50%',
            margin: '20px auto',
            animation: 'spin 1s linear infinite'
          }} />
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location, error: 'Access Denied. Admins only.' }} replace />;
  }

  return children;
}

function App() {
  // Check for updates and clear cache if needed
  React.useEffect(() => {
    const updateOccurred = checkForUpdates();
    if (updateOccurred) {
      console.log('App updated - caches cleared for fresh data');
    }
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="App">
            <Helmet>
              <title>Sarkari Result 2024 » sarkariresult.com</title>
              <meta name="description" content="Sarkari Results, Latest Online Form | Result 2024" />
            </Helmet>
            
            <Routes>
              <Route path="/admin-login" element={
                <>
                  <PWAStatus />
                  <Header />
                  <AdminLogin />
                </>
              } />
              <Route
                path="/admin/*"
                element={
                  <RequireAuth>
                    <>
                      <PWAStatus />
                      <Header />
                      <AdminDashboard />
                    </>
                  </RequireAuth>
                }
              />
              <Route
                path="/jobs/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <JobDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/results/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <ResultDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/admit-cards/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <AdmitCardDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/answer-keys/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <AnswerKeyDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/admissions/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <AdmissionDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/documents/:slug"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <DocumentDetails />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
              <Route
                path="/*"
                element={
                  <>
                    <PWAStatus />
                    <Header />
                    <Navigation />
                    <HeroSection />
                    <QuickLinks />
                    <MainContent />
                    <Footer />
                    <PWAInstallButton />
                  </>
                }
              />
        </Routes>
        <Analytics />
        <SpeedInsights />
      </div>
        </AuthProvider>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App; 
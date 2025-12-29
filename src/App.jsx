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
import SEO from './components/SEO';
import SEOAnalytics from './components/SEOAnalytics';
import { supabase } from './supabaseClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import JobDetails from './components/JobDetails';
import ResultDetails from './components/ResultDetails';
import AdmitCardDetails from './components/AdmitCardDetails';
import AnswerKeyDetails from './components/AnswerKeyDetails';
import AdmissionDetails from './components/AdmissionDetails';
import DocumentDetails from './components/DocumentDetails';
import JobsPage from './components/JobsPage';
import ResultsPage from './components/ResultsPage';
import AdmitCardsPage from './components/AdmitCardsPage';
import AdmissionsPage from './components/AdmissionsPage';
import AnswerKeysPage from './components/AnswerKeysPage';
import DocumentsPage from './components/DocumentsPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import DisclaimerPage from './components/DisclaimerPage';
import SyllabusPage from './components/SyllabusPage';
import SearchResultsPage from './components/SearchResultsPage';
import './App.css';
import './components/ContentQuality.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { checkForUpdates } from './utils/versionCheck';
import { performanceOptimizations } from './utils/seoOptimizations';

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

    // Preload critical resources for performance
    performanceOptimizations.preloadCriticalResources();
  }, []);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <div className="App">
              {/* Hidden SEO Analytics - No Visual Impact */}
              <SEOAnalytics />
              
              {/* Global SEO Meta Tags */}
              <Helmet>
                <html lang="en-IN" />
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                
                {/* Global Site Tags */}
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
                <meta name="bingbot" content="index, follow" />
                
                {/* Performance and Caching */}
                <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
                <meta name="theme-color" content="#1e40af" />
                
                {/* Geo Tags */}
                <meta name="geo.region" content="IN" />
                <meta name="geo.placename" content="India" />
                <meta name="geo.position" content="20.5937;78.9629" />
                <meta name="ICBM" content="20.5937, 78.9629" />
                
                {/* Additional Performance Tags */}
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="dns-prefetch" href="//fonts.gstatic.com" />
                <link rel="dns-prefetch" href="//cdnjs.cloudflare.com" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                
                {/* Font Optimization */}
                <link 
                  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
                  rel="stylesheet"
                />
              </Helmet>
              
              <Routes>
                <Route path="/admin-login" element={
                  <>
                    <SEO 
                      title="Admin Login - Secure Access"
                      description="Secure admin login portal for Sarkari Result website management. Authorized personnel only."
                      keywords="admin login, secure access, management portal"
                    />
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
                        <SEO 
                          title="Admin Dashboard - Content Management"
                          description="Admin dashboard for managing government job notifications, results, and website content."
                          keywords="admin dashboard, content management, website administration"
                        />
                        <PWAStatus />
                        <Header />
                        <AdminDashboard />
                      </>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <>
                      <SEO 
                        title="Search Results - Find Government Jobs & Notifications"
                        description="Search through thousands of government job notifications, results, admit cards, and recruitment updates. Find what you're looking for quickly."
                        keywords="search jobs, find notifications, government job search, sarkari naukri search"
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <SearchResultsPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
                  }
                />
                <Route
                  path="/jobs"
                  element={
                    <>
                      <SEO 
                        title="Latest Government Jobs 2025 - Sarkari Naukri Notifications"
                        description="Latest government job notifications 2025. Apply for central and state government jobs, banking, railway, SSC, UPSC, and more sarkari naukri opportunities."
                        keywords="latest government jobs 2025, sarkari naukri, government vacancy, job notification, recruitment 2025, employment opportunity"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Latest Jobs', url: '/jobs' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <JobsPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
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
                  path="/results"
                  element={
                    <>
                      <SEO 
                        title="Sarkari Results 2025 - Government Exam Results"
                        description="Latest sarkari results 2025. Check government exam results, merit lists, cut-off marks, and score cards for all competitive exams."
                        keywords="sarkari result 2025, government exam result, merit list, scorecard, result notification, exam results"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Results', url: '/results' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <ResultsPage />
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
                  path="/admit-card"
                  element={
                    <>
                      <SEO 
                        title="Admit Card Download 2025 - Hall Ticket"
                        description="Download admit cards and hall tickets for government exams 2025. Get your exam admit card, call letter, and examination hall ticket."
                        keywords="admit card download, hall ticket, exam admit card, call letter, examination admit card 2025"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Admit Cards', url: '/admit-card' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <AdmitCardsPage />
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
                  path="/answer-key"
                  element={
                    <>
                      <SEO 
                        title="Answer Key 2025 - Official Answer Keys"
                        description="Download official answer keys 2025 for government exams. Check exam answer keys, solution papers, and question paper solutions."
                        keywords="answer key 2025, official answer key, exam answer key, solution paper, question paper solution"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Answer Keys', url: '/answer-key' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <AnswerKeysPage />
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
                  path="/admission"
                  element={
                    <>
                      <SEO 
                        title="Admission Notifications 2025 - College & University Admissions"
                        description="Latest admission notifications 2025 for colleges and universities. Apply for undergraduate, postgraduate, and professional course admissions."
                        keywords="admission notification, college admission, university admission, entrance exam, admission form 2025"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Admissions', url: '/admission' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <AdmissionsPage />
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
                  path="/syllabus"
                  element={
                    <>
                      <SEO 
                        title="Exam Syllabus 2025 - Study Material & Exam Pattern"
                        description="Download exam syllabus 2025, study material, and exam patterns for government exams. Comprehensive preparation guides and course curriculum."
                        keywords="exam syllabus, study material, exam pattern, course curriculum, preparation guide 2025"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Syllabus', url: '/syllabus' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <SyllabusPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <>
                      <SEO 
                        title="Important Documents - Forms & Certificates"
                        description="Download important documents, forms, certificates, and official papers for government job applications and exam preparations."
                        keywords="important documents, forms download, certificates, official papers, government documents"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Documents', url: '/documents' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <DocumentsPage />
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
                  path="/contact"
                  element={
                    <>
                      <SEO 
                        title="Contact Us - Get in Touch"
                        description="Contact Sarkari Result team for queries, feedback, or support. Get in touch with us for any assistance regarding government jobs and exam notifications."
                        keywords="contact us, support, feedback, help, customer service"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Contact', url: '/contact' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <ContactPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <>
                      <SEO 
                        title="Privacy Policy - Data Protection"
                        description="Read our privacy policy to understand how we collect, use, and protect your personal information on Sarkari Result website."
                        keywords="privacy policy, data protection, personal information, website terms"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Privacy Policy', url: '/privacy' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <PrivacyPolicyPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
                  }
                />
                <Route
                  path="/disclaimer"
                  element={
                    <>
                      <SEO 
                        title="Disclaimer - Terms of Use"
                        description="Read our disclaimer and terms of use for Sarkari Result website. Important information about our content and services."
                        keywords="disclaimer, terms of use, website terms, conditions"
                        breadcrumbs={[
                          { name: 'Home', url: '/' },
                          { name: 'Disclaimer', url: '/disclaimer' }
                        ]}
                      />
                      <PWAStatus />
                      <Header />
                      <Navigation />
                      <DisclaimerPage />
                      <Footer />
                      <PWAInstallButton />
                    </>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <>
                      <SEO 
                        title="Sarkari Result 2025 - Latest Government Jobs, Results & Notifications"
                        description="Get latest sarkari results, government job notifications, admit cards, answer keys, exam results, recruitment updates, and employment news. Your trusted source for all government exam information."
                        keywords="sarkari result 2025, government jobs, sarkari naukri, latest jobs, admit card, answer key, exam results, recruitment, vacancy, government exam, notification, online form, employment news"
                        breadcrumbs={[
                          { name: 'Home', url: '/' }
                        ]}
                      />
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
import React, { useState, useEffect } from 'react';
import './AdsterraDiagnostics.css';

const AdsterraDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState({
    websiteApprovalStatus: 'unknown',
    adBlockerDetected: false,
    scriptLoadStatus: 'unknown',
    containerPresent: false,
    networkConnectivity: 'unknown',
    adFillRate: 'unknown',
    domainVerification: 'unknown'
  });

  const [showDiagnostics, setShowDiagnostics] = useState(false);

  useEffect(() => {
    if (showDiagnostics) {
      runDiagnostics();
    }
  }, [showDiagnostics]);

  const runDiagnostics = async () => {
    // 1. Check if ad scripts are loading
    const checkScriptLoad = () => {
      const adsterraScripts = document.querySelectorAll('script[src*="adsterra"]');
      return adsterraScripts.length > 0 ? 'loaded' : 'not-found';
    };

    // 2. Check for ad blockers
    const checkAdBlocker = () => {
      // Simple ad blocker detection
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      const isBlocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      return isBlocked;
    };

    // 3. Check if containers exist
    const checkContainers = () => {
      const nativeContainers = document.querySelectorAll('[id*="container-1972ed0e1033ca27ce9a64591bb2e00c"]');
      const bannerContainers = document.querySelectorAll('[id*="adsterra-banner-container"]');
      return nativeContainers.length > 0 || bannerContainers.length > 0;
    };

    // 4. Network connectivity test
    const checkNetworkConnectivity = async () => {
      try {
        const response = await fetch('//pl27486686.profitableratecpm.com/', { 
          method: 'HEAD', 
          mode: 'no-cors' 
        });
        return 'connected';
      } catch (error) {
        return 'blocked';
      }
    };

    setDiagnostics({
      scriptLoadStatus: checkScriptLoad(),
      adBlockerDetected: checkAdBlocker(),
      containerPresent: checkContainers(),
      networkConnectivity: await checkNetworkConnectivity(),
      websiteApprovalStatus: 'check-dashboard',
      adFillRate: 'varies',
      domainVerification: 'check-dashboard'
    });
  };

  const getDiagnosticColor = (status) => {
    if (status === 'loaded' || status === 'connected' || status === true) return '#10b981';
    if (status === 'blocked' || status === 'not-found' || status === false) return '#ef4444';
    return '#f59e0b';
  };

  const getRecommendations = () => {
    const recommendations = [];

    if (diagnostics.adBlockerDetected) {
      recommendations.push({
        issue: 'Ad Blocker Detected',
        solution: 'Ad blockers are preventing ads from loading. Test with ad blocker disabled or use incognito mode.',
        priority: 'high'
      });
    }

    if (diagnostics.scriptLoadStatus === 'not-found') {
      recommendations.push({
        issue: 'Ad Scripts Not Loading',
        solution: 'Adsterra scripts are not being loaded. Check if the website is approved in your Adsterra dashboard.',
        priority: 'high'
      });
    }

    if (!diagnostics.containerPresent) {
      recommendations.push({
        issue: 'Ad Containers Missing',
        solution: 'Ad container elements are not found in the DOM. Ensure components are properly rendered.',
        priority: 'medium'
      });
    }

    if (diagnostics.networkConnectivity === 'blocked') {
      recommendations.push({
        issue: 'Network Connectivity Issues',
        solution: 'Cannot reach Adsterra servers. Check firewall settings or network restrictions.',
        priority: 'high'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        issue: 'No Critical Issues Found',
        solution: 'Ads may take 30-60 seconds to appear. If still not showing, check your Adsterra dashboard for approval status.',
        priority: 'info'
      });
    }

    return recommendations;
  };

  return (
    <div className="adsterra-diagnostics">
      <div className="diagnostic-header">
        <h3>🔍 Adsterra Ad Diagnostics</h3>
        <button 
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="diagnostic-toggle"
        >
          {showDiagnostics ? 'Hide Diagnostics' : 'Run Diagnostics'}
        </button>
      </div>

      {showDiagnostics && (
        <div className="diagnostic-content">
          <div className="diagnostic-tests">
            <h4>🧪 Test Results</h4>
            
            <div className="test-item">
              <span className="test-name">Ad Scripts Loading:</span>
              <span 
                className="test-status" 
                style={{ color: getDiagnosticColor(diagnostics.scriptLoadStatus) }}
              >
                {diagnostics.scriptLoadStatus}
              </span>
            </div>

            <div className="test-item">
              <span className="test-name">Ad Blocker Detected:</span>
              <span 
                className="test-status" 
                style={{ color: getDiagnosticColor(diagnostics.adBlockerDetected) }}
              >
                {diagnostics.adBlockerDetected ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="test-item">
              <span className="test-name">Ad Containers Present:</span>
              <span 
                className="test-status" 
                style={{ color: getDiagnosticColor(diagnostics.containerPresent) }}
              >
                {diagnostics.containerPresent ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="test-item">
              <span className="test-name">Network Connectivity:</span>
              <span 
                className="test-status" 
                style={{ color: getDiagnosticColor(diagnostics.networkConnectivity) }}
              >
                {diagnostics.networkConnectivity}
              </span>
            </div>
          </div>

          <div className="recommendations">
            <h4>💡 Recommendations</h4>
            {getRecommendations().map((rec, index) => (
              <div 
                key={index} 
                className={`recommendation ${rec.priority}`}
              >
                <strong>{rec.issue}:</strong>
                <p>{rec.solution}</p>
              </div>
            ))}
          </div>

          <div className="setup-checklist">
            <h4>✅ Adsterra Setup Checklist</h4>
            <ul>
              <li>✅ Website added to Adsterra dashboard</li>
              <li>⏳ Website approval status: Check your dashboard</li>
              <li>✅ Ad codes implemented in components</li>
              <li>✅ Multiple ad placements configured</li>
              <li>⏳ Domain verification: Ensure thesarkariresult.info is approved</li>
              <li>⏳ Ad format selected: Native Banner (4 images with text)</li>
              <li>⏳ BOOST CPM toggle: Should be enabled for higher rates</li>
            </ul>
          </div>

          <div className="troubleshooting-tips">
            <h4>🛠️ Troubleshooting Tips</h4>
            <div className="tip-group">
              <h5>If ads still don't show:</h5>
              <ol>
                <li><strong>Check Adsterra Dashboard:</strong> Verify your website is "Approved" status</li>
                <li><strong>Domain Match:</strong> Ensure the domain in dashboard exactly matches thesarkariresult.info</li>
                <li><strong>Ad Unit Keys:</strong> Verify the ad unit IDs match your dashboard codes</li>
                <li><strong>Traffic Requirements:</strong> Adsterra has no minimum traffic, but quality matters</li>
                <li><strong>Content Policy:</strong> Ensure content complies with Adsterra policies</li>
                <li><strong>Geo-targeting:</strong> Some ads may not fill for all countries</li>
                <li><strong>Time of Day:</strong> Ad fill rates vary by time and day</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsterraDiagnostics;

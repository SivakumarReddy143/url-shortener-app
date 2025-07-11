import { Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import './App.css';
import UrlShortenerPage from './UrlShortenerPage.tsx';
import StatisticsPage from './StatisticsPage.tsx';

// Component to handle redirects
function RedirectComponent() {
  const { shortcode } = useParams<{ shortcode: string }>();
  
  // Get stored URLs from localStorage
  const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
  const urlData = storedUrls.find((url: any) => 
    url.shortenedUrl.includes(`/r/${shortcode}`) || url.shortcode === shortcode
  );
  
  if (urlData) {
    // Check if URL has expired
    const expiryDate = new Date(urlData.expiryDate);
    const currentDate = new Date();
    
    if (currentDate <= expiryDate) {
      // Redirect to original URL
      window.location.href = urlData.originalUrl;
      return <div>Redirecting to {urlData.originalUrl}...</div>;
    } else {
      return <div>This link has expired.</div>;
    }
  }
  
  return <div>Link not found.</div>;
}

function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><Link to="/">URL Shortener</Link></li>
          <li><Link to="/stats">Statistics</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<UrlShortenerPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="/r/:shortcode" element={<RedirectComponent />} />
      </Routes>
    </div>
  );
}

export default App;

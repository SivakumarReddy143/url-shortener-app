import React, { useState, useEffect } from 'react';

interface ShortenedUrl {
  originalUrl: string;
  shortenedUrl: string;
  expiryDate: string;
  shortcode: string;
}

const StatisticsPage: React.FC = () => {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    // Load shortened URLs from localStorage
    const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    setShortenedUrls(storedUrls);
  }, []);

  const clearAllUrls = () => {
    localStorage.removeItem('shortenedUrls');
    setShortenedUrls([]);
  };

  const isExpired = (expiryDate: string) => {
    return new Date() > new Date(expiryDate);
  };

  return (
    <div>
      <h2>URL Statistics</h2>
      
      {shortenedUrls.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>No shortened URLs found.</p>
          <p>Create some shortened URLs on the main page to see statistics here.</p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p><strong>Total URLs:</strong> {shortenedUrls.length}</p>
            <button 
              onClick={clearAllUrls}
              style={{
                background: '#f44336',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear All
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Original URL</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Shortened URL</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Shortcode</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Expiry Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {shortenedUrls.map((url, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', maxWidth: '200px', wordBreak: 'break-all' }}>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                        {url.originalUrl}
                      </a>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a href={url.shortenedUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                        {url.shortenedUrl}
                      </a>
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                      {url.shortcode}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {new Date(url.expiryDate).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: isExpired(url.expiryDate) ? '#ffebee' : '#e8f5e8',
                        color: isExpired(url.expiryDate) ? '#c62828' : '#2e7d32'
                      }}>
                        {isExpired(url.expiryDate) ? 'EXPIRED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default StatisticsPage; 
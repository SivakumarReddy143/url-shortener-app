import React, { useState } from 'react';
import * as yup from 'yup';

interface UrlInput {
  originalUrl: string;
  validityDays: string;
  shortcode: string;
}

interface ShortenedUrl {
  originalUrl: string;
  shortenedUrl: string;
  expiryDate: string;
  shortcode: string;
}

const MAX_URLS = 5;

// Validation schema
const urlSchema = yup.object().shape({
  originalUrl: yup.string().url('Please enter a valid URL').required('URL is required'),
  validityDays: yup.number().min(1, 'Must be at least 1 day').required('Validity period is required'),
  shortcode: yup.string().matches(/^[a-zA-Z0-9]*$/, 'Shortcode must be alphanumeric').optional()
});

const UrlShortenerPage: React.FC = () => {
  const [inputs, setInputs] = useState<UrlInput[]>([
    { originalUrl: '', validityDays: '', shortcode: '' },
  ]);
  const [results, setResults] = useState<ShortenedUrl[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (idx: number, field: keyof UrlInput, value: string) => {
    setInputs((prev) => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const addField = () => {
    if (inputs.length < MAX_URLS) {
      setInputs([...inputs, { originalUrl: '', validityDays: '', shortcode: '' }]);
    }
  };

  const removeField = (idx: number) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const generateShortUrl = (originalUrl: string, shortcode?: string): string => {
    const baseUrl = window.location.origin;
    const code = shortcode || Math.random().toString(36).substring(2, 8);
    return `${baseUrl}/r/${code}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    const validationErrors: string[] = [];
    const newResults: ShortenedUrl[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      try {
        await urlSchema.validate(input);
        const shortenedUrl = generateShortUrl(input.originalUrl, input.shortcode);
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + parseInt(input.validityDays));
        newResults.push({
          originalUrl: input.originalUrl,
          shortenedUrl,
          expiryDate: expiryDate.toISOString(),
          shortcode: input.shortcode || 'Auto-generated'
        });
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          validationErrors.push(`URL ${i + 1}: ${error.message}`);
        }
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setResults(newResults);
    const existingResults = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    localStorage.setItem('shortenedUrls', JSON.stringify([...existingResults, ...newResults]));
  };

  return (
    <div>
      <h2>Shorten URLs</h2>
      <form onSubmit={handleSubmit}>
        {inputs.map((input, idx) => (
          <div key={idx} className="url-input-card">
            <label>Original URL:
              <input type="url" required value={input.originalUrl} onChange={e => handleChange(idx, 'originalUrl', e.target.value)} placeholder="https://example.com" />
            </label>
            <label>Validity (days):
              <input type="number" min="1" required value={input.validityDays} onChange={e => handleChange(idx, 'validityDays', e.target.value)} placeholder="e.g. 7" />
            </label>
            <label>Shortcode (optional):
              <input type="text" value={input.shortcode} onChange={e => handleChange(idx, 'shortcode', e.target.value)} placeholder="e.g. mycode123" />
            </label>
            {inputs.length > 1 && <button type="button" onClick={() => removeField(idx)}>Remove</button>}
          </div>
        ))}
        {inputs.length < MAX_URLS && <button type="button" className="add-btn" onClick={addField}>Add another URL</button>}
        <button type="submit" className="submit-btn">Shorten</button>
      </form>

      {errors.length > 0 && (
        <div style={{ color: 'red', marginTop: '16px', padding: '12px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          <strong>Validation Errors:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h3>Shortened URLs</h3>
          {results.map((result, idx) => (
            <div key={idx} className="short-url-card">
              <p><strong>Original URL:</strong> {result.originalUrl}</p>
              <p><strong>Shortened URL:</strong> <a href={result.shortenedUrl} target="_blank" rel="noopener noreferrer">{result.shortenedUrl}</a></p>
              <p><strong>Expiry Date:</strong> {new Date(result.expiryDate).toLocaleDateString()}</p>
              <p><strong>Shortcode:</strong> {result.shortcode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlShortenerPage; 
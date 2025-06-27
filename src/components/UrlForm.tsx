import React, { useState } from 'react';
import { CreateUrlRequest, FormErrors } from '../types';
import { validateUrlForm } from '../utils/validation';

interface UrlFormProps {
  onSubmit: (data: CreateUrlRequest) => void;
  loading: boolean;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<CreateUrlRequest>({
    originalUrl: '',
    customShortCode: '',
    expiresAt: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateUrlForm(formData);
    setErrors(validation.errors);
    
    if (validation.isValid) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      originalUrl: '',
      customShortCode: '',
      expiresAt: ''
    });
    setErrors({});
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Shorten Your URL</h3>
        <p className="body2 text-secondary">
          Create a short, memorable link for your long URLs
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="originalUrl" className="form-label">
            Original URL *
          </label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            className={`form-input ${errors.originalUrl ? 'error' : ''}`}
            placeholder="https://example.com/very-long-url"
            value={formData.originalUrl}
            onChange={handleInputChange}
            disabled={loading}
            required
          />
          {errors.originalUrl && (
            <div className="form-error">{errors.originalUrl}</div>
          )}
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="fade-in">
            <div className="form-group">
              <label htmlFor="customShortCode" className="form-label">
                Custom Short Code
              </label>
              <input
                type="text"
                id="customShortCode"
                name="customShortCode"
                className={`form-input ${errors.customShortCode ? 'error' : ''}`}
                placeholder="my-custom-link"
                value={formData.customShortCode}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.customShortCode && (
                <div className="form-error">{errors.customShortCode}</div>
              )}
              <div className="body2 text-secondary mt-1">
                Leave empty to generate automatically (3-20 characters, letters, numbers, and hyphens only)
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="expiresAt" className="form-label">
                Expiry Date
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                className={`form-input ${errors.expiresAt ? 'error' : ''}`}
                value={formData.expiresAt}
                onChange={handleInputChange}
                disabled={loading}
              />
              {errors.expiresAt && (
                <div className="form-error">{errors.expiresAt}</div>
              )}
              <div className="body2 text-secondary mt-1">
                Leave empty for no expiration
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                Creating...
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default UrlForm; 
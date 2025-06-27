import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from '../utils/logger';
import { 
  ShortenedUrl, 
  ApiResponse, 
  CreateUrlResponse, 
  ClickData,
  CreateUrlRequest,
  GetUrlStatsResponse,
  UrlStats
} from '../types';

// Mock data for demonstration
const mockShortenedUrls: ShortenedUrl[] = [
  {
    id: '1',
    originalUrl: 'https://www.google.com',
    shortCode: 'abc123',
    shortUrl: 'https://short.url/abc123',
    createdAt: new Date().toISOString(),
    isActive: true,
    clickCount: 42
  },
  {
    id: '2',
    originalUrl: 'https://www.github.com',
    shortCode: 'def456',
    shortUrl: 'https://short.url/def456',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isActive: true,
    clickCount: 15
  }
];

const mockClickData: ClickData[] = [
  {
    id: '1',
    shortCode: 'abc123',
    clickedAt: new Date().toISOString(),
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    referrer: 'https://www.google.com',
    country: 'United States',
    city: 'New York',
    device: 'Desktop',
    browser: 'Chrome'
  },
  {
    id: '2',
    shortCode: 'abc123',
    clickedAt: new Date(Date.now() - 3600000).toISOString(),
    ipAddress: '192.168.1.2',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    referrer: 'https://www.facebook.com',
    country: 'Canada',
    city: 'Toronto',
    device: 'Mobile',
    browser: 'Safari'
  }
];

const mockUrlStats: UrlStats = {
  totalClicks: 42,
  uniqueClicks: 38,
  averageClicksPerDay: 8.4,
  topReferrers: ['Google', 'Facebook', 'Twitter', 'Direct'],
  topCountries: ['United States', 'Canada', 'United Kingdom', 'Germany'],
  clickTrend: [
    { date: '2024-01-01', clicks: 5 },
    { date: '2024-01-02', clicks: 8 },
    { date: '2024-01-03', clicks: 12 },
    { date: '2024-01-04', clicks: 6 },
    { date: '2024-01-05', clicks: 11 }
  ]
};

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'https://api.short.url';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        logger.info('API Request', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data
        });
        return config;
      },
      (error) => {
        logger.error('API Request Error', { error });
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.info('API Response', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
        return response;
      },
      (error) => {
        logger.error('API Response Error', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data
        });
        return Promise.reject(error);
      }
    );
  }

  // Create shortened URL
  async createShortUrl(request: CreateUrlRequest): Promise<CreateUrlResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (!request.originalUrl) {
        throw new Error('Original URL is required');
      }

      // Generate short code
      const shortCode = request.customShortCode || this.generateShortCode();
      
      // Check if custom short code already exists
      if (request.customShortCode && mockShortenedUrls.some(url => url.shortCode === request.customShortCode)) {
        throw new Error('Custom short code already exists');
      }

      const newUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: request.originalUrl,
        shortCode,
        shortUrl: `https://short.url/${shortCode}`,
        createdAt: new Date().toISOString(),
        expiresAt: request.expiresAt,
        isActive: true,
        clickCount: 0
      };

      // Add to mock data
      mockShortenedUrls.push(newUrl);

      logger.info('Short URL created successfully', { shortCode: newUrl.shortCode });

      return {
        success: true,
        data: newUrl
      };

    } catch (error) {
      logger.error('Failed to create short URL', { error, request });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get URL statistics
  async getUrlStats(shortCode: string): Promise<GetUrlStatsResponse> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Find URL in mock data
      const url = mockShortenedUrls.find(u => u.shortCode === shortCode);
      if (!url) {
        throw new Error('URL not found');
      }

      // Filter clicks for this URL
      const urlClicks = mockClickData.filter(click => click.shortCode === shortCode);

      logger.info('URL statistics retrieved successfully', { shortCode });

      return {
        success: true,
        data: {
          stats: mockUrlStats,
          clicks: urlClicks
        }
      };

    } catch (error) {
      logger.error('Failed to get URL statistics', { error, shortCode });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get all shortened URLs (for demo purposes)
  async getShortenedUrls(): Promise<ApiResponse<ShortenedUrl[]>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return {
        success: true,
        data: mockShortenedUrls
      };

    } catch (error) {
      logger.error('Failed to get shortened URLs', { error });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Delete shortened URL
  async deleteShortUrl(id: string): Promise<ApiResponse<boolean>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const index = mockShortenedUrls.findIndex(url => url.id === id);
      if (index === -1) {
        throw new Error('URL not found');
      }

      mockShortenedUrls.splice(index, 1);

      logger.info('Short URL deleted successfully', { id });

      return {
        success: true,
        data: true
      };

    } catch (error) {
      logger.error('Failed to delete short URL', { error, id });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Track click (simulate redirect)
  async trackClick(shortCode: string): Promise<ApiResponse<string>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const url = mockShortenedUrls.find(u => u.shortCode === shortCode);
      if (!url) {
        throw new Error('URL not found');
      }

      // Update click count
      url.clickCount++;

      // Add click data
      const clickData: ClickData = {
        id: Date.now().toString(),
        shortCode,
        clickedAt: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'Direct',
        country: 'Unknown',
        city: 'Unknown',
        device: this.getDeviceType(),
        browser: this.getBrowserType()
      };

      mockClickData.push(clickData);

      logger.info('Click tracked successfully', { shortCode, originalUrl: url.originalUrl });

      return {
        success: true,
        data: url.originalUrl
      };

    } catch (error) {
      logger.error('Failed to track click', { error, shortCode });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Get original URL for redirect
  async getOriginalUrl(shortCode: string): Promise<ApiResponse<{ originalUrl: string }>> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Find URL in mock data
      const url = mockShortenedUrls.find(u => u.shortCode === shortCode);
      if (!url) {
        throw new Error('URL not found');
      }

      logger.info('Original URL retrieved successfully', { shortCode });

      return {
        success: true,
        data: { originalUrl: url.originalUrl }
      };

    } catch (error) {
      logger.error('Failed to get original URL', { error, shortCode });
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Helper methods
  private generateShortCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  private getBrowserType(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }
}

// Export singleton instance
export const apiService = new ApiService(); 
export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  clickCount: number;
}

export interface ClickData {
  id: string;
  shortCode: string;
  clickedAt: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  country: string;
  city: string;
  device: string;
  browser: string;
}

export interface UrlStats {
  totalClicks: number;
  uniqueClicks: number;
  averageClicksPerDay: number;
  topReferrers: string[];
  topCountries: string[];
  clickTrend: ClickTrend[];
}

export interface ClickTrend {
  date: string;
  clicks: number;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customShortCode?: string;
  expiresAt?: string;
}

export interface CreateUrlResponse {
  success: boolean;
  data?: ShortenedUrl;
  error?: string;
}

export interface GetUrlStatsResponse {
  success: boolean;
  data?: {
    stats: UrlStats;
    clicks: ClickData[];
  };
  error?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
} 
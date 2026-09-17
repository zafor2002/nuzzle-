/**
 * Nuzzle Core API Client
 * Robust typed HTTP client with Bearer Token auth and error handling.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: unknown;
  meta?: Record<string, unknown>;
}

function getBaseApiUrl(): string {
  // 1. Explicit environment variable
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0 && envUrl !== '/api') {
    return envUrl.replace(/\/+$/, '');
  }

  // 2. Production or hosted browser environment (e.g. *.vercel.app, *.netlify.app, etc.)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://nuzzle-backend.vercel.app/api';
    }
  }

  // 3. Local Vite dev environment (proxied via vite.config.ts to localhost:3000)
  return '/api';
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Restore session token if present
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('nuzzle_auth_token');
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('nuzzle_auth_token', token);
      } else {
        localStorage.removeItem('nuzzle_auth_token');
      }
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const baseUrl = getBaseApiUrl();
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const primaryUrl = `${baseUrl}${cleanEndpoint}`;
    
    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type to JSON if not uploading FormData (browser sets boundary automatically)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const performFetch = async (targetUrl: string) => {
      const response = await fetch(targetUrl, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { message: text };
      }

      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          statusText: response.statusText,
          data,
        };
      }

      return {
        ok: true,
        status: response.status,
        data: data as ApiResponse<T>,
      };
    };

    try {
      const result = await performFetch(primaryUrl);
      if (result.ok) {
        return result.data!;
      }

      // If primary request failed with gateway or not found error, attempt failover
      const isRelative = primaryUrl.startsWith('/api');
      const failoverUrl = isRelative
        ? `https://nuzzle-backend.vercel.app/api${cleanEndpoint}`
        : `/api${cleanEndpoint}`;

      if (failoverUrl !== primaryUrl && (result.status >= 500 || result.status === 404 || result.status === 405)) {
        console.warn(`[ApiClient] Request to ${primaryUrl} failed (${result.status}). Retrying via ${failoverUrl}...`);
        try {
          const failoverResult = await performFetch(failoverUrl);
          if (failoverResult.ok) {
            return failoverResult.data!;
          }
        } catch (failoverErr) {
          console.warn('[ApiClient] Failover fetch failed:', failoverErr);
        }
      }

      return {
        success: false,
        error: result.data?.error || `HTTP ${result.status}: ${result.statusText}`,
        errors: result.data?.errors,
      };
    } catch (err: any) {
      // Network error on primary — attempt failover
      const isRelative = primaryUrl.startsWith('/api');
      const failoverUrl = isRelative
        ? `https://nuzzle-backend.vercel.app/api${cleanEndpoint}`
        : `/api${cleanEndpoint}`;

      if (failoverUrl !== primaryUrl) {
        console.warn(`[ApiClient] Network request failed for ${primaryUrl}. Retrying via ${failoverUrl}...`);
        try {
          const failoverResult = await performFetch(failoverUrl);
          if (failoverResult.ok) {
            return failoverResult.data!;
          }
        } catch (fErr: any) {
          console.warn('[ApiClient] Failover also encountered network error:', fErr.message);
        }
      }

      console.warn(`[ApiClient] Network request failed for ${primaryUrl}:`, err.message);
      return {
        success: false,
        error: err.message || 'Network connection failed',
      };
    }
  }

  public get<T = any>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          query.append(key, String(val));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Layer 5 Media Storage: Upload image file or base64 data to /api/upload
   */
  public async uploadMedia(file: File | string): Promise<ApiResponse<{ url: string; key: string; size: number }>> {
    if (typeof file === 'string') {
      return this.post('/upload', { image: file });
    }
    const formData = new FormData();
    formData.append('file', file);
    return this.request('/upload', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Layer 6 Monitoring: Check live backend health, uptime, and database latency
   */
  public getSystemHealth(): Promise<ApiResponse<any>> {
    return this.get('/health');
  }

  /**
   * External Services: Process marketplace order payment
   */
  public checkoutMarketplace(orderData: any): Promise<ApiResponse<any>> {
    return this.post('/marketplace/checkout', orderData);
  }
}

export const apiClient = new ApiClient();

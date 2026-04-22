const BASE_URL = 'http://localhost:5001/api';

/** Origin only (no `/api`) — for `/uploads/...` URLs returned by the backend */
export const API_ORIGIN = BASE_URL.replace(/\/api\/?$/, '');

export function resolvePublicUploadUrl(url?: string | null) {
  if (!url) return '/academy-class.png';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  useAuth?: boolean;
  body?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T | null; error: string | null }> {
  const { useAuth = true, body, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers || {});
  
  let processedBody = body;
  if (typeof body === 'string' && body.length > 0 && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    processedBody = JSON.stringify(body);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (useAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      ...fetchOptions,
      body: processedBody,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { data: null, error: data.message || `Error: ${response.status}` };
    }

    return { data: data.data || data, error: null };
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error);
    const hint =
      `Cannot reach API at ${BASE_URL}. If admin login fails here, the backend is usually not running or crashed on startup ` +
      '(often Postgres not running: check backend terminal for ECONNREFUSED on port 5432).';
    return { data: null, error: hint };
  }
}

/** Multipart upload (e.g. course videos). Do not set Content-Type — browser sets boundary. */
export async function apiUploadFormData<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  useAuth = true
): Promise<{ data: T | null; error: string | null }> {
  const headers = new Headers();
  if (useAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  try {
    const response = await fetch(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
      method,
      body: formData,
      headers,
    });
    const raw = (await response.json().catch(() => ({}))) as { data?: T; message?: string };
    if (!response.ok) {
      return { data: null, error: raw.message || `Error: ${response.status}` };
    }
    const data = raw.data !== undefined ? raw.data : (raw as unknown as T);
    return { data: data as T, error: null };
  } catch (error) {
    console.error(`Upload failed for ${endpoint}:`, error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// Helper to format currency consistently
export const formatCurrency = (amount: number | string) => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `KSh ${value.toLocaleString()}`;
};

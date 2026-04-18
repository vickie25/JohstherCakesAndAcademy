const BASE_URL = 'http://localhost:5000/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  useAuth?: boolean;
  body?: any;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<{ data: T | null; error: string | null }> {
  const { useAuth = true, body, ...fetchOptions } = options;
  
  const headers = new Headers(fetchOptions.headers || {});
  
  let processedBody = body;
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
    return { data: null, error: 'Network error or server unavailable' };
  }
}

// Helper to format currency consistently
export const formatCurrency = (amount: number | string) => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `KSh ${value.toLocaleString()}`;
};

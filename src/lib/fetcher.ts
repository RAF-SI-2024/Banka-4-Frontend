const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE;

export const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${BASE_API_URL}${endpoint}`;
  const accessToken = sessionStorage.getItem('access_token');

  const config: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'Content-Type': 'application/json',
    },
  };

  let response = await fetch(url, config);

  if (response.status === 401) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      sessionStorage.setItem('access_token', newAccessToken);

      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      response = await fetch(url, config);
    }
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  return response.json();
};

export const refreshAccessToken = async () => {
  const refreshToken = sessionStorage.getItem('refresh_token');

  if (!refreshToken) {
    console.log('No refresh token available');
    return null;
  }

  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      console.log('Failed to refresh token');
      return null;
    }

    const data = await res.json();
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
};

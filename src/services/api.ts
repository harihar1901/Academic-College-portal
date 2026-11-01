const API_BASE_URL = 'http://localhost:5000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('portal_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Server request failed');
  }
  return data;
}

export const authApi = {
  studentLogin: (credentials: { identifier: string; password: string }) =>
    fetchJson<{ success: boolean; user: any; token: string; role: string }>('/auth/student/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  studentRegister: (data: { name: string; email: string; studentId?: string; department?: string; password: string }) =>
    fetchJson<{ success: boolean; user: any; token: string; role: string }>('/auth/student/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  facultyLogin: (credentials: { identifier: string; password: string }) =>
    fetchJson<{ success: boolean; user: any; token: string; role: string }>('/auth/faculty/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  facultyRegister: (data: { name: string; email: string; staffId?: string; department?: string; password: string }) =>
    fetchJson<{ success: boolean; user: any; token: string; role: string }>('/auth/faculty/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  adminLogin: (credentials: { email: string; password: string; adminKey?: string }) =>
    fetchJson<{ success: boolean; user: any; token: string; role: string }>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
};

export const bookingsApi = {
  getAll: () => fetchJson<{ success: boolean; count: number; data: any[] }>('/bookings'),

  checkConflict: (params: { resourceId: string; date: string; startTime: string; endTime: string; excludeBookingId?: string }) =>
    fetchJson<{ success: boolean; hasConflict: boolean; message: string; conflictingBooking?: any }>('/bookings/check-conflict', {
      method: 'POST',
      body: JSON.stringify(params)
    }),

  create: (bookingData: any) =>
    fetchJson<{ success: boolean; booking: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }),

  approve: (bookingId: string, reviewerName?: string) =>
    fetchJson<{ success: boolean; booking: any }>(`/bookings/${bookingId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ reviewerName })
    }),

  reject: (bookingId: string, reason: string, reviewerName?: string) =>
    fetchJson<{ success: boolean; booking: any }>(`/bookings/${bookingId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason, reviewerName })
    }),

  cancel: (bookingId: string) =>
    fetchJson<{ success: boolean; booking: any }>(`/bookings/${bookingId}/cancel`, {
      method: 'PUT'
    }),

  resetZero: () =>
    fetchJson<{ success: boolean; message: string }>('/bookings/reset-zero', {
      method: 'POST'
    })
};

export const resourcesApi = {
  getAll: () => fetchJson<{ success: boolean; count: number; data: any[] }>('/resources')
};

export const eventsApi = {
  getAll: () => fetchJson<{ success: boolean; count: number; data: any[] }>('/events'),

  register: (eventId: string, userId: string) =>
    fetchJson<{ success: boolean; event: any }>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    }),

  unregister: (eventId: string, userId: string) =>
    fetchJson<{ success: boolean; event: any }>(`/events/${eventId}/register`, {
      method: 'DELETE',
      body: JSON.stringify({ userId })
    })
};

export const aiApi = {
  queryRoom: (query: string, expectedParticipants?: number) =>
    fetchJson<{ success: boolean; reply: string; suggestions: any[] }>('/ai/query', {
      method: 'POST',
      body: JSON.stringify({ query, expectedParticipants })
    }),

  generateNotes: (title: string, purpose?: string) =>
    fetchJson<{ success: boolean; agenda: string[]; summary: string }>('/ai/notes', {
      method: 'POST',
      body: JSON.stringify({ title, purpose })
    })
};

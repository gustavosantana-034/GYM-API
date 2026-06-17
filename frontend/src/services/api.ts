import {
  ApiResponse,
  LoginResponse,
  RegisterResponse,
  UserProfileResponse,
  Gym,
  CheckIn,
  CheckInMetrics,
  GymsSearchResponse,
  CheckInHistoryResponse
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = localStorage.getItem('fitness_token');

      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Auth endpoints
  async register(userData: { name: string; email: string; password: string }): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/token/refresh', {
      method: 'PATCH',
    });
  }

  async getProfile(): Promise<ApiResponse<UserProfileResponse>> {
    return this.request<UserProfileResponse>('/me');
  }

  // Gym endpoints
  async searchGyms(query: string): Promise<ApiResponse<GymsSearchResponse>> {
    return this.request<GymsSearchResponse>(`/gyms/search?q=${encodeURIComponent(query)}`);
  }

  async getNearbyGyms(latitude: number, longitude: number): Promise<ApiResponse<GymsSearchResponse>> {
    return this.request<GymsSearchResponse>(`/gyms/nearby?latitude=${latitude}&longitude=${longitude}`);
  }

  async createGym(gymData: { title: string; description?: string; phone?: string; latitude: number; longitude: number }): Promise<ApiResponse<Gym>> {
    return this.request<Gym>('/gyms', {
      method: 'POST',
      body: JSON.stringify(gymData),
    });
  }

  // Check-in endpoints
  async createCheckIn(gymId: string, latitude: number, longitude: number): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>(`/gyms/${gymId}/check-ins`, {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude }),
    });
  }

  async getCheckInHistory(): Promise<ApiResponse<CheckInHistoryResponse>> {
    return this.request<CheckInHistoryResponse>('/check-ins/history');
  }

  async getCheckInMetrics(): Promise<ApiResponse<CheckInMetrics>> {
    return this.request<CheckInMetrics>('/check-ins/metrics');
  }

  async validateCheckIn(checkInId: string): Promise<ApiResponse<CheckIn>> {
    return this.request<CheckIn>(`/check-ins/${checkInId}/validate`, {
      method: 'PATCH',
    });
  }
}

export const apiService = new ApiService();

import { apiService } from './api';
import { CheckIn, CheckInMetrics, Gym } from '../types';

export class CheckInService {
  async getCheckInHistory(): Promise<CheckIn[]> {
    const response = await apiService.getCheckInHistory();
    if (response.success && response.data) {
      return response.data.checkIns || [];
    }
    return [];
  }

  async getCheckInMetrics(): Promise<CheckInMetrics | null> {
    const response = await apiService.getCheckInMetrics();
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  }

  async createCheckIn(gymId: string, latitude: number, longitude: number): Promise<{ success: boolean; error?: string }> {
    const response = await apiService.createCheckIn(gymId, latitude, longitude);
    return {
      success: response.success,
      error: response.error
    };
  }

  async searchGyms(query: string): Promise<Gym[]> {
    const response = await apiService.searchGyms(query);
    if (response.success && response.data) {
      return response.data.gyms || [];
    }
    return [];
  }

  async getNearbyGyms(latitude: number, longitude: number): Promise<Gym[]> {
    const response = await apiService.getNearbyGyms(latitude, longitude);
    if (response.success && response.data) {
      return response.data.gyms || [];
    }
    return [];
  }

  async validateCheckIn(checkInId: string): Promise<{ success: boolean; error?: string }> {
    const response = await apiService.validateCheckIn(checkInId);
    return {
      success: response.success,
      error: response.error
    };
  }
}

export const checkInService = new CheckInService();

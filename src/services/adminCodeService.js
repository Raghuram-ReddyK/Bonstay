import axios from 'axios';
import { getBackendApiUrl } from '../config/apiConfig';

class AdminCodeService {
  constructor() {
    this.baseUrl = getBackendApiUrl('/admin-codes');
  }

  async submitAdminCodeRequest(requestData) {
    try {
      const response = await axios.post(`${this.baseUrl}/requests`, requestData);
      return response.data;
    } catch (error) {
      console.error('Error submitting admin code request:', error);
      throw error;
    }
  }

  // Add other admin code related methods here if needed
  async getAdminCodeRequests() {
    try {
      const url = `${this.baseUrl}/requests?t=${Date.now()}`;
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching admin code requests:', error);
      throw error;
    }
  }

  async getAdminCodeRequestById(requestId) {
    try {
      const response = await axios.get(`${this.baseUrl}/requests/${requestId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin code request by ID:', error);
      throw error;
    }
  }

  async approveAdminCodeRequest(requestId) {
    try {
      const response = await axios.put(`${this.baseUrl}/requests/${requestId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving admin code request:', error);
      throw error;
    }
  }

  async rejectAdminCodeRequest(requestId, rejectionData) {
    try {
      const response = await axios.put(`${this.baseUrl}/requests/${requestId}/reject`, rejectionData);
      return response.data;
    } catch (error) {
      console.error('Error rejecting admin code request:', error);
      throw error;
    }
  }

  async updateAdminCodeRequest(requestId, updateData) {
    try {
      const response = await axios.put(`${this.baseUrl}/requests/${requestId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin code request:', error);
      throw error;
    }
  }

  async createAdminCode(adminCodeData) {
    try {
      const response = await axios.post(`${this.baseUrl}`, adminCodeData);
      return response.data;
    } catch (error) {
      console.error('Error creating admin code:', error);
      throw error;
    }
  }

  async updateAdminCode(codeId, updateData) {
    try {
      const response = await axios.put(`${this.baseUrl}/${codeId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating admin code:', error);
      throw error;
    }
  }

  async getAdminCodes(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching admin codes:', error);
      throw error;
    }
  }

  async useAdminCode(code, registeredUserId) {
    try {
      const response = await axios.post(`${this.baseUrl}/use`, { code, registeredUserId });
      return response.data;
    } catch (error) {
      console.error('Error using admin code:', error);
      throw error;
    }
  }

  async validateAdminCode(code) {
    try {
      const response = await axios.get(`${this.baseUrl}/validate/${code}`);
      return response.data;
    } catch (error) {
      console.error('Error validating admin code:', error);
      throw error;
    }
  }
}

const adminCodeService = new AdminCodeService();
export default adminCodeService;
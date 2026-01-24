import axios from 'axios';
import { getBackendApiUrl } from '../config/apiConfig';

class HotelService {
  constructor() {
    this.baseUrl = getBackendApiUrl('/hotels');
  }

  async createHotel(hotelData) {
    try {
      const response = await axios.post(this.baseUrl, hotelData);
      return response.data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }

  async updateHotel(hotelId, updateData) {
    try {
      const response = await axios.put(`${this.baseUrl}/${hotelId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  }

  async deleteHotel(hotelId) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${hotelId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  }

  async getHotels(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
      const response = await axios.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching hotels:', error);
      throw error;
    }
  }

  async getHotelById(hotelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/${hotelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotel by ID:', error);
      throw error;
    }
  }
}

const hotelService = new HotelService();
export default hotelService;
import axios from 'axios';



const apiClient = axios.create({
  baseURL: 'https://randomuser.me/api',
  timeout: 10000, 
});
export const fetchUsersFromApi = async (page: number = 1, results: number = 20) => {
  try {
    const response = await apiClient.get(`/?page=${page}&results=${results}&seed=nexus&inc=login,name,email,phone,location,picture`);
    return response.data.results;
  } catch (error) {
    throw error;
  }
};
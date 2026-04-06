import axios from 'axios';

// Base URLs for each microservice (these run on localhost during development)
const API_BASE = {
  identity: 'http://localhost:8001',
  salary: 'http://localhost:8002',
  search: 'http://localhost:8003',
  stats: 'http://localhost:8004',
  vote: 'http://localhost:8005',
};

// Store JWT token from login
let authToken = localStorage.getItem('authToken') || null;

// ============================================
// AUTHENTICATION APIS
// ============================================

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Response with success message
 */
export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE.identity}/signup`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Authenticate user and get JWT token
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} Response with access_token
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE.identity}/login`, {
      email,
      password,
    });
    authToken = response.data.access_token;
    localStorage.setItem('authToken', authToken);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// SALARY SUBMISSION APIS
// ============================================

/**
 * Submit salary data
 * @param {Object} salaryData - Salary information
 * @returns {Promise} Response with submission ID
 */
export const submitSalary = async (salaryData) => {
  try {
    const response = await axios.post(`${API_BASE.salary}/submit`, salaryData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// SEARCH APIS
// ============================================

/**
 * Search approved salaries with filters
 * @param {Object} filters - Search filters (role, company, country, level)
 * @returns {Promise} Array of matching salary submissions
 */
export const searchSalaries = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.company) params.append('company', filters.company);
    if (filters.country) params.append('country', filters.country);
    if (filters.level) params.append('level', filters.level);

    const response = await axios.get(
      `${API_BASE.search}/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// STATISTICS APIS
// ============================================

/**
 * Get salary statistics with optional filters
 * @param {Object} filters - Filter criteria (role, company, country, level)
 * @returns {Promise} Statistics object with salary analytics
 */
export const getStats = async (filters) => {
  try {
    const params = new URLSearchParams();
    if (filters.role) params.append('role', filters.role);
    if (filters.company) params.append('company', filters.company);
    if (filters.country) params.append('country', filters.country);
    if (filters.level) params.append('level', filters.level);

    const response = await axios.get(
      `${API_BASE.stats}/stats?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// VOTING APIS
// ============================================

/**
 * Vote on a salary submission
 * @param {string} submissionId - ID of the submission
 * @param {string} voteType - 'UPVOTE' or 'DOWNVOTE'
 * @returns {Promise} Response with updated submission status
 */
export const voteOnSubmission = async (submissionId, voteType) => {
  try {
    const response = await axios.post(
      `${API_BASE.vote}/vote/${submissionId}`,
      { vote_type: voteType },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

/**
 * Get current auth token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => authToken;

/**
 * Clear auth token and logout
 */
export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

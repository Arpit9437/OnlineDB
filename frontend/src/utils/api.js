import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL

export const api = {
  register: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        username,
        password,
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Registration failed"
      throw new Error(message)
    }
  },

  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Login failed"
      throw new Error(message)
    }
  },
}

export const dbApi = {
  listTables: async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/db/tables`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch tables"
      throw new Error(message)
    }
  },

  createTable: async (token, tableName, columns) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/db/create-table`,
        {
          tablename: tableName,
          cols: columns,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Failed to create table"
      throw new Error(message)
    }
  },

  deleteTable: async (token, tableName) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/db/delete-table`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          tableName,
        },
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Failed to delete table"
      throw new Error(message)
    }
  },

  getTableSchema: async (token, tableName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/db/table/${tableName}/schema`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch table schema"
      throw new Error(message)
    }
  },

  getTableData: async (token, tableName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/db/table/${tableName}/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Failed to fetch table data"
      throw new Error(message)
    }
  },

  runQuery: async (token, sql) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/db/run-query`,
        {
          sql,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || "Query execution failed"
      throw new Error(message)
    }
  },
}

/**
 * Dependencies injection library
 */
import apiClient from '@/utils/httpClient'
import type { APIResponse } from '@/interfaces/response.interface'
import { API } from '@/commons/config/revenue.config'

const revenueService = {
  /**
  * Function
  */
  // getRevenue
  async getRevenue(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.post(API.REVENUE, params)
  },
  // revenueDataChart
  async revenueDataChart(params?: unknown): Promise<APIResponse<any[]>> {
    return await apiClient.post(API.REVENUE_NEW, params)
  },
}

export default revenueService

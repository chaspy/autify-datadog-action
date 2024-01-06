import axios, {AxiosResponse} from 'axios'
import {getResultsMetrics} from './datadog'

export type Inputs = {
  autify_personal_access_token: string
  autify_project_id: string
  datadog_api_key: string
}

interface TestPlan {
  id: number
  name: string
  created_at: string
  updated_at: string
}

interface getResults {
  id: number
  status: string
  duration: number
  started_at: string
  finished_at: string
  created_at: string
  updated_at: string
  review_needed: boolean
  test_plan: TestPlan
}

export function processGetResultsData(getResultsData: getResults[]): void {
  getResultsData.forEach((result, index) => {
    if (result === null || result.test_plan === null) {
      return // skip if test_plan.name is null. This happens when rerunning a test
    }

    const status = result.status
    const duration_sec = Math.floor(result.duration) / 1000 // duration unit is mill seconds
    const started_at = result.started_at // 2023-11-30T06:01:21.029Z, ISO8601 UTC
    const test_plan_name = result.test_plan.name

    const started_at_unixtime = new Date(started_at).getTime() // Unix timestamp in milliseconds

    const metrics: getResultsMetrics = {
      timestamp: started_at_unixtime,
      value: duration_sec,
      status: status,
      test_plan_name: test_plan_name
    }

    // submitGetResultsMetrics(metrics)
    console.log(metrics)
  })
}

export async function getResults(inputs: Inputs): Promise<getResults[] | null> {
  console.log('Hello')

  // Load inputs
  const autify_personal_access_token = inputs.autify_personal_access_token
  const autify_project_id = inputs.autify_project_id
  // const datadog_api_key = inputs.datadog_api_key
  const per_page = 100

  const url = `https://app.autify.com/api/v1/projects/${autify_project_id}/results?per_page=${per_page}`
  const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${autify_personal_access_token}`
  }

  try {
    const response: AxiosResponse<getResults[]> = await axios.get(url, {
      headers
    })
    return response.data
  } catch (error) {
    console.log(`Error: ${error}`)
    return null
  }
}

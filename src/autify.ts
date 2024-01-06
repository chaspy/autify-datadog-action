import axios, {AxiosResponse} from 'axios'

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

export async function getResults(inputs: Inputs): Promise<getResults | null> {
  console.log('Hello')

  // Load inputs
  const autify_personal_access_token = inputs.autify_personal_access_token
  const autify_project_id = inputs.autify_project_id
  // const datadog_api_key = inputs.datadog_api_key

  const url = `https://app.autify.com/projects/${autify_project_id}/results`
  const headers = {
    accept: 'application/json',
    Authorization: `Bearer ${autify_personal_access_token}`
  }

  try {
    const response: AxiosResponse<getResults> = await axios.get(url, {headers})
    return response.data
  } catch (error) {
    console.log(`Error: ${error}`)
    return null
  }
}

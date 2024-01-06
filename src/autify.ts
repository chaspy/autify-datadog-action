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

  return null
}
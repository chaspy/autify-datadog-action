import {client, v2} from '@datadog/datadog-api-client'
const configuration = client.createConfiguration()
const apiInstance = new v2.MetricsApi(configuration)

export interface getResultsMetrics {
  timestamp: number
  value: number
  status: string
  test_plan_name: string
}

function createSubmitMetricsRequest(
  metric: string,
  timestamp: number,
  value: number,
  unit: string,
  tags: string[]
): v2.MetricsApiSubmitMetricsRequest {
  return {
    body: {
      series: [
        {
          metric: metric,
          type: 3, // gauge
          points: [
            {
              timestamp: timestamp,
              value: value
            }
          ],
          tags: tags,
          unit: unit
        }
      ]
    }
  }
}

function submitMetrics(
  metricName: string,
  params: v2.MetricsApiSubmitMetricsRequest
) {
  apiInstance
    .submitMetrics(params)
    .then((data: v2.IntakePayloadAccepted) => {
      console.log(`API called successfully. ${metricName} is submitted.`)
    })
    .catch((error: any) => console.error(error))
}

export function submitGetResultsMetrics(metrics: getResultsMetrics) {
  const tags = [
    `status:${metrics.status}`,
    `test_plan_name:${metrics.test_plan_name}`
  ]

  const durationSecondParams = createSubmitMetricsRequest(
    'custom.autify_datadog_action.result.duration_second',
    metrics.timestamp,
    metrics.value,
    'Second',
    tags
  )

  const countParams = createSubmitMetricsRequest(
    'custom.autify-datadog-action.result.count',
    metrics.timestamp,
    1,
    'Count',
    tags
  )

  if (
    isTimestampAvailable(metrics.timestamp) &&
    !isStatusRunning(metrics.status)
  ) {
    submitMetrics(
      'custom.autify_datadog_action.result.duration_second',
      durationSecondParams
    )
    submitMetrics('custom.autify-datadog-action.result.count', countParams)
  } else {
    console.log(
      `timestamp ${metrics.timestamp} is not available. skip to send metrics`
    )
  }
}

// https://docs.datadoghq.com/ja/api/latest/metrics/?code-lang=typescript#submit-metrics
// points:
// Timestamps should be in POSIX time in seconds,
// and cannot be more than ten minutes in the future or more than one hour in the past.
function isTimestampAvailable(unixTimestampSeconds: number): boolean {
  const currentTime = Math.floor(Date.now() / 1000)
  const tenMinutes = 10 * 60
  const oneHour = 60 * 60

  if (unixTimestampSeconds > currentTime + tenMinutes) {
    return false // 10 minutes in the future
  } else if (unixTimestampSeconds < currentTime - oneHour) {
    return false // one hour in the past
  } else {
    return true
  }
}

// getButchRuns API returns all BatchRuns includes Running Status.
// However, 'Running' ones are useless because we want to store success rates and success results in Datadog.
export function isStatusRunning(status: string): boolean {
  return status == 'running' ? true : false
}

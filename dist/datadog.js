"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStatusRunning = exports.submitGetResultsMetrics = void 0;
const datadog_api_client_1 = require("@datadog/datadog-api-client");
const configuration = datadog_api_client_1.client.createConfiguration();
const apiInstance = new datadog_api_client_1.v2.MetricsApi(configuration);
function createSubmitMetricsRequest(metric, timestamp, value, unit, tags) {
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
    };
}
function submitMetrics(metricName, params) {
    apiInstance
        .submitMetrics(params)
        .then((data) => {
        console.log(`API called successfully. ${metricName} is submitted.`);
    })
        .catch((error) => console.error(error));
}
function submitGetResultsMetrics(metrics) {
    const tags = [
        `status:${metrics.status}`,
        `test_plan_name:${metrics.test_plan_name}`
    ];
    const durationSecondParams = createSubmitMetricsRequest('custom.autify_datadog_action.result.duration_second', metrics.timestamp, metrics.value, 'Second', tags);
    const countParams = createSubmitMetricsRequest('custom.magicpod-datadog-action.test_case.count', metrics.timestamp, 1, 'Count', tags);
    if (isTimestampAvailable(metrics.timestamp) &&
        !isStatusRunning(metrics.status)) {
        submitMetrics('custom.magicpod-datadog-action.test_case.duration_second', durationSecondParams);
        submitMetrics('custom.magicpod-datadog-action.test_case.count', countParams);
    }
    else {
        console.log(`timestamp ${metrics.timestamp} is not available. skip to send metrics`);
    }
}
exports.submitGetResultsMetrics = submitGetResultsMetrics;
// https://docs.datadoghq.com/ja/api/latest/metrics/?code-lang=typescript#submit-metrics
// points:
// Timestamps should be in POSIX time in seconds,
// and cannot be more than ten minutes in the future or more than one hour in the past.
function isTimestampAvailable(unixTimestampSeconds) {
    const currentTime = Math.floor(Date.now() / 1000);
    const tenMinutes = 10 * 60;
    const oneHour = 60 * 60;
    console.log('debug');
    console.log('currentTime');
    console.log(currentTime);
    console.log('unixTimestampSeconds');
    console.log(unixTimestampSeconds);
    if (unixTimestampSeconds > currentTime + tenMinutes) {
        return false; // 10 minutes in the future
    }
    else if (unixTimestampSeconds < currentTime - oneHour) {
        return false; // one hour in the past
    }
    else {
        return true;
    }
}
// getButchRuns API returns all BatchRuns includes Running Status.
// However, 'Running' ones are useless because we want to store success rates and success results in Datadog.
function isStatusRunning(status) {
    return status == 'running' ? true : false;
}
exports.isStatusRunning = isStatusRunning;

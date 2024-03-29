# autify-datadog-action

GitHub Action to send metrics of Autify to Datadog

## Usage

```yaml
- name: Run autify-datadog-action
  uses: chaspy/autify-datadog-action@main
  with:
    autify_personal_access_token: ${{ secrets.AUTIFY_PERSONAL_ACCESS_TOKEN }}
    autify_project_id: ${{ secrets.AUTIFY_PROJECT_ID}}
  env:
    DD_API_KEY: ${{ secrets.DD_API_KEY }}
```

## Environment variables

| Name       | Description                                                                    | Required |
| ---------- | ------------------------------------------------------------------------------ | -------- |
| DD_API_KEY | [Datadog API Key](https://docs.datadoghq.com/account_management/api-app-keys/) | Yes      |

## Inputs

| Name                         | Description                                                                     | Required | Default |
| ---------------------------- | ------------------------------------------------------------------------------- | -------- | ------- |
| autify_personal_access_token | [Autify Personal Access Token](https://help.autify.com/docs/integrate-with-api) | Yes      |         |
| autify_project_id            | Autify project id                                                               | Yes      |         |

## Metrics

| Name                                                  | Description                                                    | Type  | Unit   |
| ----------------------------------------------------- | -------------------------------------------------------------- | ----- | ------ |
| `custom.autify_datadog_action.result.duration_second` | Time taken to execute the test result.                         | Gauge | Second |
| `custom.autify_datadog_action.result.count`           | Whether the test was run or not. always send 1 for started_at. | Gauge | Count  |

## Supported Tags

`stutus` and `test_plan_name` are supported as tags.

## Known Limitation

The Datadog [Submit Metrics API](https://docs.datadoghq.com/api/latest/metrics/?code-lang=typescript#submit-metrics) cannot accept timestamps more than one hour in the past. Therefore, at least, this job must be run within an hour of the most recent test run. It is recommended to run this job once every 20 minutes, as multiple runs will not duplicate metrics.

## How to test

See [chaspy/autify-datadog-action-test](https://github.com/chaspy/autify-datadog-action-test)

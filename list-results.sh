#!/bin/bash
autify web api list-results \
  --project-id  229 \
  --per-page 100 \
#   --test-plan-id 60188

# return
# [
#   {
#     "id": 1891800,
#     "status": "failed",
#     "duration": 265718,
#     "started_at": "2023-03-29T08:29:40.730Z",
#     "finished_at": "2023-03-29T08:34:06.449Z",
#     "created_at": "2023-03-29T08:29:38.263Z",
#     "updated_at": "2023-03-29T08:34:18.623Z",
#     "review_needed": false,
#     "test_plan": {
#       "id": 60188,
#       "name": "スモークテスト",
#       "created_at": "2021-07-08T10:25:50.380Z",
#       "updated_at": "2023-01-19T02:23:32.671Z"
#     }
#   }
# ]

# metrics design
# name: custom.autify_datadog_action.result.duration_second
# type: gauge
# value: duration seconds (use result of "duration")
# at: started_at
# tags: [test_plan_name, status]
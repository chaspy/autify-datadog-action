import * as core from '@actions/core'
import {run} from './run'

const main = async (): Promise<void> => {
  await run({
    autify_personal_access_token: core.getInput(
      'autify_personal_access_token',
      {required: true}
    ),
    autify_project_id: core.getInput('autify_project_id', {
      required: true
    })
  })
}

main().catch(e => core.setFailed(e instanceof Error ? e : String(e)))

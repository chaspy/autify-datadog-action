import {Inputs, getResults} from './autify'

// eslint-disable-next-line @typescript-eslint/require-await
export const run = async (inputs: Inputs): Promise<void> => {
  // Get response from autify
  ;(async () => {
    const data = await getResults(inputs)
    // if (data) {
    //   processBatchRunsData(data, inputs)
    // } else {
    //   console.log('Error occurred, no data received')
    // }
  })()
}

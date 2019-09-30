import {Logger} from 'loggerhythm';

import {IIdentity} from '@essential-projects/iam_contracts';
import {ExternalTaskWorker} from '@process-engine/external_task_api_client';
import {DataModels, HandleExternalTaskAction} from '@process-engine/consumer_api_contracts';

const logger = Logger.createLogger('external_task_worker_playground');

const processEngineUrl = 'http://localhost:8000';
const maxTaskToPoll = 10;
const pollingTimeout = 1000;

const identity: IIdentity = {
  // eslint-disable-next-line max-len
  token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdmNTI3YmM1YjUyZTlmMDM5OGIzZTRkYzE4NmI2ZWE2IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NjIwNTE4NzksImV4cCI6MTU2MjA1NTQ3OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJ0ZXN0X3Jlc291cmNlIl0sImNsaWVudF9pZCI6ImJwbW5fc3R1ZGlvIiwic3ViIjoiOThhNDQzNmYtOTk4ZC00YWZhLTkzYWItZTUzYTlhMTA1NTNhIiwiYXV0aF90aW1lIjoxNTYyMDUxODc5LCJpZHAiOiJsb2NhbCIsIkRlZmF1bHRfVGVzdF9MYW5lIjoiMTIzIiwiTGFuZUEiOiJ0cnVlIiwiTGFuZUIiOiJ0cnVlIiwiTGFuZUMiOiJ0cnVlIiwiY2FuX3JlYWRfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fd3JpdGVfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fY3JlYXRlX2xvY2FsX2FkbWluIjoidHJ1ZSIsIkFnZW50IjoidHJ1ZSIsIm5hbWUiOiJhbGljZSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJ0ZXN0X3Jlc291cmNlIl0sImFtciI6WyJwd2QiXX0.AroGYUY-kCP3NVfn2-TxwvVvEMN4B97ZxeqR7hse7J-9jatdN1NsmS3Tj_GD7pluBFJmq0sZSHWRL1qk356eTNzgpZCoBCLcgBwoL2s3eFAWrr5V_K4x2PSdbpyFf1_ffdg25_c1WikaPLJElmKTcNoH8M1Bn3bVw4bAt7mOz_9IhGUN5FNjMj4kIEOpY9aN-GHCzhrCwRtj-AwOuEn1Gp9dkmTYwlTALH9-rMCa8SyI5RNL47LaY9cBLp9EBXOfSlDcqe2gxVPC_3EKtbX1sSUf4x9gU0hQlXcQ6TTzFmuyBRtA8IkZXykZq1BNCC2CgurXBoajVh90qPuezKasKA',
  userId: 'alice',
};

export async function subscribeToExternalTasks(): Promise<void> {

  logger.info('Erstelle 100 Worker');

  for (let i = 0; i < 100; i++) {

    const topic = `randomTopic${i}`;
    logger.info(`Starte Worker für topic ${topic}`);

    const callback =
      async (externalTask: DataModels.ExternalTask.ExternalTask<any>): Promise<DataModels.ExternalTask.ExternalTaskSuccessResult> => {
        logger.info(`Neue Aufgabe für Worker ${i}`);
        return new DataModels.ExternalTask.ExternalTaskSuccessResult(externalTask.id, '');
      };

    const externalTaskWorker = createExternalTaskWorker(processEngineUrl, topic, callback);

    externalTaskWorker.start();
  }
}

function createExternalTaskWorker(url: string, topic: string, callback: HandleExternalTaskAction<any, any>): ExternalTaskWorker<any, any> {

  const externalTaskWorker = new ExternalTaskWorker<any, any>(url, identity, topic, maxTaskToPoll, pollingTimeout, callback);

  return externalTaskWorker;
}

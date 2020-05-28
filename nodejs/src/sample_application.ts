import {Logger} from 'loggerhythm';

import {IIdentity} from '@essential-projects/iam_contracts';
import {ExternalTaskWorker} from '@process-engine/consumer_api_client';
import {DataModels, HandleExternalTaskAction} from '@process-engine/consumer_api_contracts';

import * as AuthTokenProvider from './auth_token_provider';

const logger = Logger.createLogger('external_task_worker_playground');

const processEngineUrl = 'http://localhost:8000';
const maxTaskToPoll = 5;
const pollingTimeout = 1000;

type SuccessResult = DataModels.ExternalTask.ExternalTaskSuccessResult<object>;
type ExternalTask = DataModels.ExternalTask.ExternalTask<any>;

export async function subscribeToExternalTasks(): Promise<void> {

  const identity = await AuthTokenProvider.getInitialIdentity();

  logger.info('Erstelle 32 Worker');

  for (let i = 0; i < 31; i++) {

    const topic = `randomTopic${i}`;
    logger.info(`Starte Worker für topic ${topic}`);

    const callback = async (externalTask: ExternalTask): Promise<SuccessResult> => {
      logger.info(`Neue Aufgabe für Worker ${i}`);
      return new DataModels.ExternalTask.ExternalTaskSuccessResult(externalTask.id, {bla: 'blubb'});
    };

    const externalTaskWorker = createExternalTaskWorker(processEngineUrl, topic, callback, identity);

    externalTaskWorker.start();
  }
}

function createExternalTaskWorker(
  url: string,
  topic: string,
  callback: HandleExternalTaskAction<object, object>,
  identity: IIdentity,
): ExternalTaskWorker<object, object> {

  const externalTaskWorker = new ExternalTaskWorker<object, object>(url, identity, topic, maxTaskToPoll, pollingTimeout, callback);

  return externalTaskWorker;
}

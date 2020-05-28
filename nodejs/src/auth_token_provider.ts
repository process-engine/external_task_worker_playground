/* eslint-disable @typescript-eslint/camelcase */
import {Logger} from 'loggerhythm';

import {HttpClient} from '@essential-projects/http';
import {IIdentity} from '@essential-projects/iam_contracts';
import {IdentityService} from '@process-engine/iam';

const httpClientForAuthority = new HttpClient();
const authurityUrl = 'http://localhost:5000';
const loginEndpoint = 'connect/token';
const loginRequestBody = {
  client_id: 'bpmn_studio',
  client_secret: 'secret',
  response_type: ['id_token', 'token'],
  scope: 'test_resource',
  grant_type: 'client_credentials',
};
const loginRequestHeaders = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

const identityService = new IdentityService();

const logger = Logger.createLogger('external_task_worker_playground:auth_token_provider');

export async function getIdentity(): Promise<IIdentity> {

  if (!checkIsIdentityServerAvailable()) {
    logger.warn('Identity Server is currently not available. Returning default auth token');

    return {
      // eslint-disable-next-line max-len
      token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdmNTI3YmM1YjUyZTlmMDM5OGIzZTRkYzE4NmI2ZWE2IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NjIwNTE4NzksImV4cCI6MTU2MjA1NTQ3OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJ0ZXN0X3Jlc291cmNlIl0sImNsaWVudF9pZCI6ImJwbW5fc3R1ZGlvIiwic3ViIjoiOThhNDQzNmYtOTk4ZC00YWZhLTkzYWItZTUzYTlhMTA1NTNhIiwiYXV0aF90aW1lIjoxNTYyMDUxODc5LCJpZHAiOiJsb2NhbCIsIkRlZmF1bHRfVGVzdF9MYW5lIjoiMTIzIiwiTGFuZUEiOiJ0cnVlIiwiTGFuZUIiOiJ0cnVlIiwiTGFuZUMiOiJ0cnVlIiwiY2FuX3JlYWRfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fd3JpdGVfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fY3JlYXRlX2xvY2FsX2FkbWluIjoidHJ1ZSIsIkFnZW50IjoidHJ1ZSIsIm5hbWUiOiJhbGljZSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJ0ZXN0X3Jlc291cmNlIl0sImFtciI6WyJwd2QiXX0.AroGYUY-kCP3NVfn2-TxwvVvEMN4B97ZxeqR7hse7J-9jatdN1NsmS3Tj_GD7pluBFJmq0sZSHWRL1qk356eTNzgpZCoBCLcgBwoL2s3eFAWrr5V_K4x2PSdbpyFf1_ffdg25_c1WikaPLJElmKTcNoH8M1Bn3bVw4bAt7mOz_9IhGUN5FNjMj4kIEOpY9aN-GHCzhrCwRtj-AwOuEn1Gp9dkmTYwlTALH9-rMCa8SyI5RNL47LaY9cBLp9EBXOfSlDcqe2gxVPC_3EKtbX1sSUf4x9gU0hQlXcQ6TTzFmuyBRtA8IkZXykZq1BNCC2CgurXBoajVh90qPuezKasKA',
      userId: 'alice',
    };
  }

  try {
    const response = await httpClientForAuthority.post<object, any>(`${authurityUrl}/${loginEndpoint}`, loginRequestBody, loginRequestHeaders);

    const token = response.result.access_token;

    const identity = await identityService.getIdentity(token);

    return identity;
  } catch (error) {
    logger.error('Failed to login at IdentityServer!', error.message);
    throw error;
  }
}

function checkIsIdentityServerAvailable(): boolean {
  try {
    httpClientForAuthority.get(authurityUrl);

    return true;
  } catch (error) {
    return false;
  }
}

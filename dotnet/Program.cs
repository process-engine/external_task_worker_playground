using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using EssentialProjects.IAM.Contracts;

using ProcessEngine.ConsumerAPI.Contracts.DataModel;
using ProcessEngine.ExternalTaskAPI.Client;

namespace dotnet
{

    public class SampleResult
    {
      public string Bla {get; set;} = "Bla";
    }

    public class Program
    {
        private static readonly IIdentity identity = new Identity() {
          UserId = "alice",
          Token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjdmNTI3YmM1YjUyZTlmMDM5OGIzZTRkYzE4NmI2ZWE2IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NjIwNTE4NzksImV4cCI6MTU2MjA1NTQ3OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo1MDAwIiwiYXVkIjpbImh0dHA6Ly9sb2NhbGhvc3Q6NTAwMC9yZXNvdXJjZXMiLCJ0ZXN0X3Jlc291cmNlIl0sImNsaWVudF9pZCI6ImJwbW5fc3R1ZGlvIiwic3ViIjoiOThhNDQzNmYtOTk4ZC00YWZhLTkzYWItZTUzYTlhMTA1NTNhIiwiYXV0aF90aW1lIjoxNTYyMDUxODc5LCJpZHAiOiJsb2NhbCIsIkRlZmF1bHRfVGVzdF9MYW5lIjoiMTIzIiwiTGFuZUEiOiJ0cnVlIiwiTGFuZUIiOiJ0cnVlIiwiTGFuZUMiOiJ0cnVlIiwiY2FuX3JlYWRfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fd3JpdGVfcHJvY2Vzc19tb2RlbCI6InRydWUiLCJjYW5fY3JlYXRlX2xvY2FsX2FkbWluIjoidHJ1ZSIsIkFnZW50IjoidHJ1ZSIsIm5hbWUiOiJhbGljZSIsInNjb3BlIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJ0ZXN0X3Jlc291cmNlIl0sImFtciI6WyJwd2QiXX0.AroGYUY-kCP3NVfn2-TxwvVvEMN4B97ZxeqR7hse7J-9jatdN1NsmS3Tj_GD7pluBFJmq0sZSHWRL1qk356eTNzgpZCoBCLcgBwoL2s3eFAWrr5V_K4x2PSdbpyFf1_ffdg25_c1WikaPLJElmKTcNoH8M1Bn3bVw4bAt7mOz_9IhGUN5FNjMj4kIEOpY9aN-GHCzhrCwRtj-AwOuEn1Gp9dkmTYwlTALH9-rMCa8SyI5RNL47LaY9cBLp9EBXOfSlDcqe2gxVPC_3EKtbX1sSUf4x9gU0hQlXcQ6TTzFmuyBRtA8IkZXykZq1BNCC2CgurXBoajVh90qPuezKasKA"
        };

        private static readonly string ProcessEngineUrl = "http://localhost:8000";
        private static readonly int MaxTaskToPoll = 10;
        private static readonly int PollingTimeout = 1000;

        private static List<ExternalTaskWorker<object, SampleResult>> Workers = new List<ExternalTaskWorker<object, SampleResult>>();

        static void Main(string[] args)
        {
            Console.WriteLine("Erstelle 100 ExternalTask Worker");

            for (int i = 0; i < 100; i++) {

                var topic = $"randomTopic{i}";
                Console.WriteLine($"Starte Worker für Topic {topic}");

                var externalTaskWorker = CreateExternalTaskWorker(topic);

                externalTaskWorker.Start();

                Workers.Add(externalTaskWorker);
            }

            while(true) {

            }
        }

        private static ExternalTaskWorker<object, SampleResult> CreateExternalTaskWorker(string topic)
        {
          var externalTaskWorker = new ExternalTaskWorker<object, SampleResult>(
              ProcessEngineUrl,
              identity,
              topic,
              MaxTaskToPoll,
              PollingTimeout,
              Callback<object, SampleResult>
          );

          return externalTaskWorker;
        }

        private static Task<ExternalTaskResultBase> Callback<TPayload, TResult>(ExternalTask<TPayload> externalTask)
            where TPayload : new()
        {
            var samplePayload = new SampleResult();
            return Task.Run<ExternalTaskResultBase>(() => {
              return new ExternalTaskSuccessResult<SampleResult>(externalTask.Id, samplePayload);
            });
        }
    }
}

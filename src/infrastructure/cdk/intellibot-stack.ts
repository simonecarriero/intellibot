import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, Deployment, Stage } from 'aws-cdk-lib/aws-apigateway';

import path from 'path';

export class IntellibotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'intellibot-lambda-handler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `../telegraf/index.js`),
      handler: 'handler',
      functionName: 'intellibot-lambda',
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
      },
    });

    const api = new RestApi(this, 'intellibot-api', {
      restApiName: 'Intellibotbot API',
      deployOptions: { stageName: 'prod' },
    });

    api.root.addResource('intellibot').addMethod('POST', new LambdaIntegration(lambda, { proxy: true }));

    new cdk.CfnOutput(this, 'apiHostname', { value: `${api.restApiId}.execute-api.localhost.localstack.cloud` });
    new cdk.CfnOutput(this, 'apiUrl', { value: `${api.url}intellibot` });
  }
}

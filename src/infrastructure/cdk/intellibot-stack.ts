import * as cdk from 'aws-cdk-lib';
import { RestApi, LambdaIntegration, Deployment, Stage } from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import path from 'path';

export class IntellibotStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'intellibot', {
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const lambda = new NodejsFunction(this, 'intellibot-lambda-handler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `../index.js`),
      handler: 'handler',
      functionName: 'intellibot-lambda',
      environment: {
        BOT_TOKEN: process.env.BOT_TOKEN!,
        DYNAMODB_TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(lambda);

    const api = new RestApi(this, 'intellibot-api', {
      restApiName: 'Intellibotbot API',
      deployOptions: { stageName: 'prod' },
    });

    api.root.addResource('intellibot').addMethod('POST', new LambdaIntegration(lambda, { proxy: true }));

    new cdk.CfnOutput(this, 'apiHostname', { value: `${api.restApiId}.execute-api.localhost.localstack.cloud` });
    new cdk.CfnOutput(this, 'apiUrl', { value: `${api.url}intellibot` });
  }
}

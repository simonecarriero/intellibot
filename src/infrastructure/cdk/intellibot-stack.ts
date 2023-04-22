import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import path from 'path';

export class FooStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambda = new NodejsFunction(this, 'intellibot-lambda-handler', {
      runtime: Runtime.NODEJS_18_X,
      entry: path.join(__dirname, `./intellibot-function.js`),
      handler: 'handler',
      functionName: 'intellibot-lambda',
    });
  }
}

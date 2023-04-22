#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FooStack } from './intellibot-stack';

const app = new cdk.App();
new FooStack(app, 'FooStack', {});

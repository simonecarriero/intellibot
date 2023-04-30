#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IntellibotStack } from './intellibot-stack';

const app = new cdk.App();
new IntellibotStack(app, 'IntellibotStack', {});

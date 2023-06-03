#!/usr/bin/env node
import { IntellibotStack } from './intellibot-stack';
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';

const app = new cdk.App();
new IntellibotStack(app, 'IntellibotStack', {});

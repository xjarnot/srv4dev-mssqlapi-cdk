#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SqlsrdevapivStack } from '../lib/sqlsrdevapiv-stack';

const app = new cdk.App();
const  staackProps= {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT as string,
    region: process.env.CDK_DEFAULT_REGION as string,    
  },
};
new SqlsrdevapivStack(app, 'SqlsrdevapivStack',staackProps);
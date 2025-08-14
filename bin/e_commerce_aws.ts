#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';

const app = new cdk.App();

const env: cdk.Environment =  {
  account:  "820242915576",
  region:  "us-east-1"
}

const tags = {
  cost: "Ecommerce",
  team: "PabloDev"
}

const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  env: env,
  tags: tags
});

const eCommerceApiStack = new EcommerceApiStack(app, 'EcommerceApi', {
  env: env,
  tags: tags,
  productsFetchHandler: productsAppStack.productsFetchHandler
});


eCommerceApiStack.addDependency(productsAppStack)
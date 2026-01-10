#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';

import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';
import { EventDdbStack } from '../lib/eventsDdb-stack';

const app = new cdk.App();

const env: cdk.Environment = {
  account: "820242915576",
  region: "us-east-1",
};

const tags = {
  cost: "Ecommerce",
  team: "PabloDev",
};

// 🔹 Stack de Layers (primeiro)
const productsAppLayersStack = new ProductsAppLayersStack(
  app,
  'ProductsAppLayers',
  {
    env,
    tags,
  }
);

// 🔹 DynamoDB de eventos
const eventDdbStack = new EventDdbStack(app, 'EventDdbStack', {
  env,
  tags,
});

// 🔹 Stack principal de produtos
const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  env,
  tags,
  eventsDdb: eventDdbStack.table,
});

// 🔹 Dependências explícitas
productsAppStack.addDependency(productsAppLayersStack);
productsAppStack.addDependency(eventDdbStack);

// 🔹 API Gateway
const eCommerceApiStack = new EcommerceApiStack(app, 'EcommerceApi', {
  env,
  tags,
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
});

eCommerceApiStack.addDependency(productsAppStack);

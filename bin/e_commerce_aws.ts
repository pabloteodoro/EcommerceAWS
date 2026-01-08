#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { ProductsAppStack } from '../lib/productsApp-stack';
import { EcommerceApiStack } from '../lib/ecommerceApi-stack';
import { ProductsAppLayersStack } from '../lib/productsAppLayers-stack';
import { EventDdbStack } from '../lib/eventsDdb-stack';


const app = new cdk.App();

const env: cdk.Environment =  {
  account:  "820242915576",
  region:  "us-east-1"
}

const tags = {
  cost: "Ecommerce",
  team: "PabloDev"
}

const productsAppLayersStack = new ProductsAppLayersStack(app, 'ProductsAppLayers', {
  env: env,
  tags: tags
});

const eventDdbStack = new EventDdbStack(app, 'EventDdbStack', {
  env: env,
  tags: tags
})
const productsAppStack = new ProductsAppStack(app, 'ProductsApp', {
  eventsDdb: eventDdbStack.table,
  env: env,
  tags: tags
});

productsAppStack.addDependency(productsAppLayersStack);
productsAppStack.addDependency(eventDdbStack);

const eCommerceApiStack = new EcommerceApiStack(app, 'EcommerceApi', {
  env: env,
  tags: tags,
  productsFetchHandler: productsAppStack.productsFetchHandler,
  productsAdminHandler: productsAppStack.productsAdminHandler,
});


eCommerceApiStack.addDependency(productsAppStack)
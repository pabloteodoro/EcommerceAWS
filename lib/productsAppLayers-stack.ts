import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ProductsAppLayersStack extends Stack {
  public readonly productsLayer: lambda.LayerVersion;
  public readonly productEventsLayer: lambda.LayerVersion;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.productsLayer = new lambda.LayerVersion(this, 'ProductsLayer', {
      code: lambda.Code.fromAsset('lambda/layers/productsLayer'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    });

    this.productEventsLayer = new lambda.LayerVersion(this, 'ProductEventsLayer', {
      code: lambda.Code.fromAsset('lambda/layers/productEventsLayer'),
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    });

    // 🔹 SSM Parameters (OBRIGATÓRIO)
    new ssm.StringParameter(this, 'ProductsLayerVersionArnParam', {
      parameterName: 'ProductsLayerVersionArn',
      stringValue: this.productsLayer.layerVersionArn,
    });

    new ssm.StringParameter(this, 'ProductEventsLayerVersionArnParam', {
      parameterName: 'ProductEventsLayerVersionArn',
      stringValue: this.productEventsLayer.layerVersionArn,
    });
  }
}

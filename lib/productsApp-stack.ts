import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs";
import * as ssm from "aws-cdk-lib/aws-ssm"

export class ProductsAppStack extends cdk.Stack {
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
    readonly productsDdb: dynamodb.Table 
    readonly productsAdminHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        this.productsDdb = new dynamodb.Table(this, "ProductsDdb", {
            tableName: "products",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1
        })

        // Lambda Layers/Products

        const productsLayerArn = ssm.StringParameter.valueForStringParameter(this, "ProductsLayerVersionArn")
        const productsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "ProductsLayerVersionArn", productsLayerArn)


        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            memorySize: 512,
            functionName: "ProductsFunction",
            entry: "lambda/products/productsFunction.ts",
            handler: "handler",
            bundling: {
                minify: true,
                sourceMap: false,
                nodeModules: [
                    'aws-xray-sdk-core'
                ]
            },
            environment:  {
               PRODUCTS_DDB: this.productsDdb.tableName,
            },

            layers: [productsLayer],
            tracing: lambda.Tracing.ACTIVE,
            insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,

            timeout:  cdk.Duration.seconds(2),
        })

        this.productsDdb.grantReadData(this.productsFetchHandler)

        this.productsAdminHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsAdminFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            memorySize: 512,
            functionName: "ProductsAdminFunction",
            entry: "lambda/productsAdmin/productsAdminFunction.ts",
            handler: "handler",
            bundling: {
                minify: true,
                sourceMap: false,
                nodeModules: [
                    'aws-xray-sdk-core'
                ]
            },
            environment:  {
               PRODUCTS_DDB: this.productsDdb.tableName,
            },

            layers: [productsLayer],
            tracing: lambda.Tracing.ACTIVE,
            insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_119_0,
            
            timeout:  cdk.Duration.seconds(2),
        })

        this.productsDdb.grantWriteData(this.productsAdminHandler)
    }
}
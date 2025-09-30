import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs";

export class ProductsAppStack extends cdk.Stack {
    readonly productsFetchHandler: lambdaNodeJS.NodejsFunction
    readonly productsDdb: dynamodb.Table 

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
        this.productsFetchHandler = new lambdaNodeJS.NodejsFunction(this, "ProductsFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            memorySize: 512,
            functionName: "ProductsFunction",
            entry: "lambda/products/productsFunction.ts",
            handler: "handler",
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment:  {
               PRODUCTS_DDB: this.productsDdb.tableName,
            },

            timeout:  cdk.Duration.seconds(10),
        })

        this.productsDdb.grantReadData(this.productsFetchHandler)
    }
}
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


export async function handler(event: APIGatewayProxyEvent, 
    context: Context): Promise<APIGatewayProxyResult> {

        const lambdaRequestId = context.awsRequestId
        const apiRequestId = event.requestContext.requestId

        console.log(`API Gateway Request ID: ${apiRequestId} - Lambda Request ID: ${lambdaRequestId}`);


        const method = event.httpMethod
        if (event.resource === "/products") {
            if (event.httpMethod === "GET") {
                console.log("GET")

                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: "GET request to /products"
                    })
                }
            }
        }

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Not Found"
            })
        }
        
    }
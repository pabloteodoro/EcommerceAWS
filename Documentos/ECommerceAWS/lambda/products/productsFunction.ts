import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


export async function handler(event: APIGatewayProxyEvent, 
    context: Context): Promise<APIGatewayProxyResult> {


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
            statusCode: 404,
            body: JSON.stringify({
                message: "Not Found"
            })
        }
        
    }
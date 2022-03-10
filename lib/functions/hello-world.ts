import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
/**
 * This is the lambda entrypoint function
 *
 * @param {APIGatewayEvent} event - the event passed to us
 * @param {Context} context - the context passed to us
 * @returns {Promise<APIGatewayProxyResult>} - just a hello world statement formatted for an API Gateway
 */
export async function handler(event?: APIGatewayEvent, context?: Context): Promise<APIGatewayProxyResult> {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
  console.log(JSON.stringify({ response, event, context }));
  return response;
}

import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { Logger } from "./helpers";

// Do the following things outside of the handler. The are run once per lambda runtime initialization and re-used
// for many invocations
const TABLE_NAME = process.env.TABLE_NAME || "TABLE_NAME not set as environment variable";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

/**
 * This lambda is invoked by APIGW to add a new user to the dynamo db table. This method is called for every
 * invocation of the lambda
 *
 * @param {APIGatewayEvent} event - event sent to lambda from api gateway
 * @param {Context} context - context sent to lambda to api gateway
 * @returns {Promise<APIGatewayProxyResult>} Json response that we'll return to api gateway
 
 */
export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  const logger = new Logger(event, context);
  // Pull the parameters provided from the user out of the event.body
  if (!event.body) {
    // Make sure we were passed an event.body, else return a 500 error
    logger.log("Error, event.body undefined");
    return { statusCode: 500, body: JSON.stringify({ error: "event.body is undefined", event, context }) };
  }
  const body = JSON.parse(event.body);
  // Assemble the parameters required to put a dynamoDb Item
  const params: PutItemCommandInput = {
    TableName: TABLE_NAME,
    // The event.body object should look like: {userId: xx, name: yy, address: zz}
    Item: marshall(body)
  };
  logger.log("ddbDocClient.send()", { params });
  const response = await ddbDocClient.send(new PutItemCommand(params));
  logger.log("ddbDocClient.send response", { params, response });
  const apiProxyResult: APIGatewayProxyResult = {
    statusCode: 200,
    body: `Created User: ${body.userId}`
  };
  logger.log("returning APIGatewayProxyResult", { apiProxyResult });
  return apiProxyResult;
}

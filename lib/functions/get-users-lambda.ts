import { DynamoDBClient, ScanCommand, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

import { Logger } from "./helpers";

// Do the following things outside the handler. They are run once per lambda runtime initialization and re-used
// for many invocations
const TABLE_NAME = process.env.TABLE_NAME || "TABLE_NAME not set as environment variable";
const dynamodb = new DynamoDBClient({});
// assemble the properties required for a table scan
const params: ScanCommandInput = { TableName: TABLE_NAME };
const scan = new ScanCommand(params);

/**
 * This lambda is invoked by APIGW to get users from the dynamo db table
 *
 * @param {APIGatewayEvent} event - event sent to this lambda from api gateway
 * @param {Context} context - context sent to this lambda from api gateway
 * @returns {Promise<any>} - response this lambda send back to api gateway
 */
export async function handler(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
  const logger = new Logger(event, context);
  // it is helpful to send json formatted logs that always include the event and context
  logger.log("dynamodb.send(scan)", { params });
  // send the table scan api call (this is not very efficient)
  const results = await dynamodb.send(scan);
  logger.log("dynamodb.send(scan) results", { results, params });
  // convert the result into a list of user objects
  const users = results.Items?.map((item) => unmarshall(item));
  // assemble the Api gateway proxy response
  const apiGatewayProxyResult: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(users)
  };
  logger.log("returning APIGatewayProxyResult", { apiGatewayProxyResult });
  return apiGatewayProxyResult;
}

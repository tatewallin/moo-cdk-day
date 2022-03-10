import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "../../lib/functions/add-user-lambda";
import { aPIGatewayEvent, context } from "./helpers";

const mockDBClient = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  mockDBClient.reset();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe("put record", () => {
  test("add user", async () => {
    aPIGatewayEvent.body = JSON.stringify({
      userId: "1",
      name: "Moe",
      address: "123 St"
    });

    const params = {
      TableName: "",
      Item: {}
    };

    mockDBClient.on(PutItemCommand, params).resolves({});
    const response = await handler(aPIGatewayEvent, context);
    expect(response).toStrictEqual({ body: "Created User: 1", statusCode: 200 });
  });
  test("add user with empty event.body", async () => {
    aPIGatewayEvent.body = null;

    const params = {
      TableName: "",
      Item: {}
    };

    mockDBClient.on(PutItemCommand, params).resolves({});
    const response = await handler(aPIGatewayEvent, context);
    expect(response.statusCode).toStrictEqual(500);
  });
});

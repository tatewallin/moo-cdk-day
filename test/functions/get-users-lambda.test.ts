import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { mockClient } from "aws-sdk-client-mock";

import { handler } from "../../lib/functions/get-users-lambda";
import { aPIGatewayEvent, context } from "./helpers";

const dbClient = mockClient(DynamoDBClient);

beforeEach(() => {
  dbClient.reset();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe("scan table", () => {
  test("get no users", async () => {
    dbClient.on(ScanCommand).resolves({
      Items: undefined
    });
    const users = await handler(aPIGatewayEvent, context);
    expect(users).toStrictEqual({ body: undefined, statusCode: 200 });
  });
  test("get some users", async () => {
    const user = { userId: "1", name: "John Doe", address: "somewhere" };
    dbClient.on(ScanCommand).resolves({ Items: [marshall(user)] });
    const users = await handler(aPIGatewayEvent, context);
    expect(users).toStrictEqual({ body: JSON.stringify([user]), statusCode: 200 });
  });
});

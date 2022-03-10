import { APIGatewayEvent, Context } from "aws-lambda";

export const aPIGatewayEvent: APIGatewayEvent = {
  body: null,
  headers: {},
  httpMethod: "",
  isBase64Encoded: false,
  multiValueHeaders: {},
  multiValueQueryStringParameters: {},
  path: "",
  pathParameters: {},
  queryStringParameters: {},
  requestContext: {
    accountId: "",
    apiId: "",
    authorizer: {},
    protocol: "",
    httpMethod: "",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "",
      user: null,
      userAgent: null,
      userArn: null
    },
    path: "",
    stage: "",
    requestId: "",
    requestTimeEpoch: 0,
    resourceId: "",
    resourcePath: ""
  },
  resource: "",
  stageVariables: {}
};

export const context: Context = {
  done(error?: Error, result?: any): void {
    console.log(`No implementation for done() with ${error} and ${result}`);
  },
  fail(error: Error | string): void {
    console.log(`No implementation for fail() with ${error}`);
  },
  getRemainingTimeInMillis(): number {
    return 0;
  },
  succeed(messageOrObject: any): void {
    console.log(`No implementation for succeed() with ${messageOrObject}`);
  },
  callbackWaitsForEmptyEventLoop: false,
  functionName: "",
  functionVersion: "",
  invokedFunctionArn: "",
  memoryLimitInMB: "",
  awsRequestId: "",
  logGroupName: "",
  logStreamName: ""
};

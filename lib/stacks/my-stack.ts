import { LambdaIntegration } from "@aws-cdk/aws-apigateway";
import { OriginAccessIdentity } from "@aws-cdk/aws-cloudfront";
import { AttributeType } from "@aws-cdk/aws-dynamodb";
import { Code, Runtime } from "@aws-cdk/aws-lambda";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { Construct, Duration, RemovalPolicy } from "@aws-cdk/core";
import { MooStack, MooStackProps } from "@moo-cdk/core";
import { MooCloudfrontPublicApi, MooRegionalRestApi } from "@moo-cdk/moo-cloudfront-patterns";
import { MooTable } from "@moo-cdk/moo-dynamodb";
import { MooFunction } from "@moo-cdk/moo-lambda";
import { MooBucket } from "@moo-cdk/moo-s3";
import * as path from "path";

/**
 * test stack
 */
export class MyStack extends MooStack {
  constructor(scope: Construct, id: string, props: MooStackProps) {
    super(scope, id, props);
    // Create a bucket for static website content
    const mooBucket = new MooBucket(this, "WebBucket", {
      autoDeleteObjects: true
    });
    // Create an origin Access Identity that cloudfront can use to access web site bucket
    const originAccessIdentity = new OriginAccessIdentity(this, "WebBucketIdentity");
    // Grant the OriginAccessIdentity read access to the website bucket
    mooBucket.grantRead(originAccessIdentity);

    // Create a lambda
    const mooFn = new MooFunction(this, "ExampleLambda", {
      // running `yarn build` will esbuild our lib/lambda code into the dist/bundled directories
      code: Code.fromAsset(path.resolve(__dirname, "../../dist/bundled/hello-world")),
      handler: "hello-world.handler",
      runtime: Runtime.NODEJS_14_X
    });

    // Create a MooRegionalApi so that we can manually define origins on cloudfront
    const mooRegionalApi = new MooRegionalRestApi(this, "RegionalApi", {});

    // Create a Cloudfront Public API at https://req87259.doc-trng-dev-cld.mutualofomaha.com
    const cloudfrontPublicApi = new MooCloudfrontPublicApi(this, "CloudfrontPublicApi", {
      hostName: "req69775",
      // provide the regionalApi create above
      regionalApi: mooRegionalApi,
      // configure custom origin
      originConfigs: [
        // use the MooRegionalApi helper method to generate the origin configuration
        mooRegionalApi.getDefaultApiOriginConfig({
          isDefaultBehavior: false,
          maxTtl: Duration.seconds(0),
          minTtl: Duration.seconds(0),
          defaultTtl: Duration.seconds(0)
        }),
        // define an S3 origin as the default behavior
        {
          s3OriginSource: { s3BucketSource: mooBucket, originAccessIdentity },
          behaviors: [{ isDefaultBehavior: true }]
        }
      ]
    });

    // Create an API Key for the api gateway. Can be retrieved in aws console
    cloudfrontPublicApi.api.createApiKey("req69775-2");

    // Integrate the lambda into the api gateway with a GET method on the hello-world path. Require an API key to access
    cloudfrontPublicApi.api.root
      .addResource("hello-world")
      .addMethod("GET", new LambdaIntegration(mooFn), { apiKeyRequired: true });

    // Deploy website content to S3 Bucket with invalidation on update
    new BucketDeployment(this, "DeployWithInvalidation", {
      sources: [Source.asset(path.resolve(__dirname, "../site-contents"))],
      destinationBucket: mooBucket,
      distribution: cloudfrontPublicApi.cdn,
      distributionPaths: ["/*"]
    });

    // Create a complaint Dynamodb Table
    const usersTable = new MooTable(this, "UsersTable", {
      partitionKey: { name: "userId", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY // DO NOT USE THIS SETTING FOR PRODUCTION
    });

    // Create a lambda function resource that gets all users in the DynamoDB table
    const getUsersLambda = new MooFunction(this, "GetUsersLambda", {
      code: Code.fromAsset(path.resolve(__dirname, "../../dist/bundled/get-users-lambda")),
      handler: "get-users-lambda.handler",
      runtime: Runtime.NODEJS_14_X,
      namingSuffix: "getUsers",
      environment: {
        TABLE_NAME: usersTable.tableName
      }
    });

    // Grant the getUsers lambda read access to the dynamoDb Table
    usersTable.grantReadData(getUsersLambda);

    // Create a lambda function resource that adds users to the to DynamoDB table
    const addUserLambda = new MooFunction(this, "AddUserLambda", {
      code: Code.fromAsset(path.resolve(__dirname, "../../dist/bundled/add-user-lambda")),
      handler: "add-user-lambda.handler",
      runtime: Runtime.NODEJS_14_X,
      namingSuffix: "addUser",
      environment: {
        TABLE_NAME: usersTable.tableName
      }
    });

    // Grant the addUserLambda write access to the dynamoDb Table
    usersTable.grantWriteData(addUserLambda);

    // LESSON4, EXERCISE1 - add an api gateway resource "users" to the api gateway root (/) resource.
    // This will create a URI "/users" to which we can attach lambdas on http methods (POST/GET/UPDATE etc)
    // Hint, the api gateway is accessible from the MooCloudfrontPublicApi '.api' property.
    // Use the addResource() to add the "users" resource to the existing "root" resource.
    // - See AWS cdk resource() docs: https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.Resource.html#addwbrresourcepathpart-options
    // - See "Adding additional origin to Cloudfront distribution" in MooCloudfrontPublicApi docs: https://bitbucket.mutualofomaha.com/projects/AWS_CDK/repos/moo-cdk-constructs/browse/packages/%40moo-cdk/moo-cloudfront-patterns
    const userResource = cloudfrontPublicApi.api.root.addResource("users");
    // LESSON4, EXERCISE2 - configure the "users" method above, integrate the "getUsersLambda" with the http "GET" method
    // and require an API KEY to access the "GET /users" endpoint
    // - See AWS cdk addMethod() docs: https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.Resource.html#addwbrmethodhttpmethod-integration-options
    // - See "Adding additional origin to Cloudfront distribution" in MooCloudfrontPublicApi docs: https://bitbucket.mutualofomaha.com/projects/AWS_CDK/repos/moo-cdk-constructs/browse/packages/%40moo-cdk/moo-cloudfront-patterns
    userResource.addMethod("GET", new LambdaIntegration(getUsersLambda), { apiKeyRequired: true });
    // LESSON4, EXERCISE3 - configure the "users" method above, integrate the "addUserLambda" with the http "POST" method
    // and require an API KEY to access the "POST /users" endpoint
    // - See AWS cdk addMethod() docs: https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-apigateway.Resource.html#addwbrmethodhttpmethod-integration-options
    // - See "Adding additional origin to Cloudfront distribution" in MooCloudfrontPublicApi docs: https://bitbucket.mutualofomaha.com/projects/AWS_CDK/repos/moo-cdk-constructs/browse/packages/%40moo-cdk/moo-cloudfront-patterns
    userResource.addMethod("POST", new LambdaIntegration(addUserLambda), { apiKeyRequired: true });
  }
}

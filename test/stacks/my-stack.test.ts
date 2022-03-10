import { arrayWith, expect as expectCDK, haveResourceLike, objectLike, stringLike } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { EnvironmentName, MooStackProps } from "@moo-cdk/core";

import { MyStack } from "../../lib/stacks/my-stack";

// MooCloudfrontPublicApi uses Date() to generate a unique key between cloudfront and api gateway. It changes daily.
// Mock the global Date() method to make snapshots stable across days.
// This the date will always be 2021-01-01 in tests
beforeEach(() => {
  const DATE_TO_USE = new Date("2021-01-01");
  global.Date = jest.fn(() => DATE_TO_USE) as any;
});

// When the test is over, we want to undo the mock so that Date behaves normally
const _Date = Date;
afterEach(() => {
  global.Date = _Date;
});

export const testStackProps: MooStackProps = {
  asiName: "ABC",
  projectName: "testProject",
  environmentName: EnvironmentName.SBX,
  env: { region: "us-east-1" }
};

test("Stack Matches Snapshot", () => {
  const app = new cdk.App();
  const stack = new MyStack(app, "MyTestStack", testStackProps);
  // Snapshot should match
  expect(stack).toMatchSnapshot();
});

test("Cloudfront OriginAccessIdentity exists", () => {
  const app = new cdk.App();
  const stack = new MyStack(app, "MyTestStack", testStackProps);
  expectCDK(stack).to(haveResourceLike("AWS::CloudFront::CloudFrontOriginAccessIdentity"));
});

test("Website bucket policy grants read access to an OriginAccessIdentity", () => {
  const app = new cdk.App();
  const stack = new MyStack(app, "MyTestStack", testStackProps);
  expectCDK(stack).to(
    haveResourceLike("AWS::S3::BucketPolicy", {
      PolicyDocument: {
        Statement: arrayWith(
          objectLike({
            Action: ["s3:GetObject*", "s3:GetBucket*", "s3:List*"],
            Effect: "Allow",
            Principal: { CanonicalUser: { "Fn::GetAtt": [stringLike("*"), "S3CanonicalUserId"] } }
          })
        )
      }
    })
  );
});

test("Cdk Bucket Deployment exists for web content", () => {
  const app = new cdk.App();
  const stack = new MyStack(app, "MyTestStack", testStackProps);
  expectCDK(stack).to(haveResourceLike("Custom::CDKBucketDeployment"));
});

test("Cloudfront has a website bucket origin that is default", () => {
  const app = new cdk.App();
  const stack = new MyStack(app, "MyTestStack", testStackProps);
  expectCDK(stack).to(
    haveResourceLike("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        Origins: arrayWith(
          objectLike({
            S3OriginConfig: {
              OriginAccessIdentity: {
                "Fn::Join": ["", ["origin-access-identity/cloudfront/", { Ref: stringLike("*") }]]
              }
            }
          })
        )
      }
    })
  );
});

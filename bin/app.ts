import { App } from "@aws-cdk/core";
import { EnvironmentName, MooStackProps } from "@moo-cdk/core";

import { MyStack } from "../lib/stacks/my-stack";

const app = new App();

// Default params, are overridden if --parameters are provided during deploy time
// Param names that can overridden at deploy time can be found here: https://bitbucket.mutualofomaha.com/projects/AWS_CDK/repos/moo-cdk-constructs/browse/lib/core/moo_stack.ts
// To learn more about CloudFormation Params in CDK see: https://docs.aws.amazon.com/cdk/latest/guide/parameters.html
const projectProps: MooStackProps = {
  asiName: "cdk",
  environmentName: EnvironmentName.DEV,
  projectName: "req69775",
  env: { region: "us-east-1" }
};
const stackNamePrefix = [projectProps.asiName, projectProps.projectName].join("-");

new MyStack(app, [stackNamePrefix, "mystack"].join("-"), projectProps);

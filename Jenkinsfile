bitbucketLibrary(project: "AWS_CDK", repo: "cdk-pipeline-library")

pipelineConfig {
    dockerImage = 'repo.mutualofomaha.com:5003/com.mutualofomaha.aws_cdk/node12-alpine:latest'

    setupStage([disableConcurrentBuilds: true])

    customStage(stageName: 'Build & Test', includeInPR: true) {
        sh 'yarn'
        sh 'yarn build'
        sh 'yarn lint'
        sh 'yarn test'
        addStash('TestResults', '.jest/')
        addStash('Dist', 'dist/')
    }

    staticAnalysisStage(enableSecurityAnalysis: true)

    nodeCdkSynthStage()
    // replace the target and env with the correct deployment information
    nodeCdkDeployStage(target: "doc-trng-dev", env: "dev", stackParameters:[ASI:"cdk"], branches:["master"])
    //nodeCdkDeployStage(target: "xxx-dev", env: "dev")
    //nodeCdkDeployStage(target: "xxx-cat", env: "cat")
    //nodeCdkDeployStage(target: "xxx-prod", env: "prod")
}

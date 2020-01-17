import cdk = require('@aws-cdk/core');
import apigateway = require('@aws-cdk/aws-apigateway');
import lambda = require('@aws-cdk/aws-lambda');
import s3 = require('@aws-cdk/aws-s3');

export class LambdaService extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string) {
        super(scope, id, { env: { region: 'eu-west-1' } });

        const stage = new cdk.CfnParameter(this, 'Stage', {
            type: 'String',
            default: 'CODE',
        });

        const bucket = '__BUCKET_NAME__';
        const key = `__STACK__/${stage.value}/lambda/lambda.zip`;

        const handler = new lambda.Function(this, '__STACK__-__APP_NAME__', {
            runtime: lambda.Runtime.NODEJS_12_X,
            code: lambda.Code.fromBucket(
                s3.Bucket.fromBucketName(this, 'lambda-code-bucket', bucket),
                key,
            ),
            handler: 'server.handler',
            functionName: `__STACK__-__APP_NAME__-${stage.value}`,
        });

        // If you need access to parameter store then uncomment and adjust the following:
        // handler.addToRolePolicy(
        //     new iam.PolicyStatement({
        //         effect: iam.Effect.ALLOW,
        //         resources: ['arn:aws:ssm:eu-west-1:[your account ID goes here]:parameter/*'],
        //         actions: ['ssm:GetParameter'],
        //     }),
        // );

        // tslint:disable-next-line: no-unused-expression
        new apigateway.LambdaRestApi(this, '__APP_NAME__', {
            restApiName: `__APP_NAME__-${stage.value}`,
            description: '__DESCRIPTION__',
            proxy: true,
            handler,
            deployOptions: {
                loggingLevel: apigateway.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
        });
    }
}

const app = new cdk.App();
// tslint:disable-next-line: no-unused-expression
new LambdaService(app, '__APP_NAME__');

import * as cdk from 'aws-cdk-lib';
import { Duration, Stack, StackProps,RemovalPolicy } from "aws-cdk-lib";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { InstanceClass, InstanceSize, InstanceType, SecurityGroup, Vpc ,Peer,Port,SubnetType} from 'aws-cdk-lib/aws-ec2';
import { Credentials, DatabaseInstanceEngine,DatabaseInstance, SqlServerEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { off } from 'process';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SqlsrdevapivStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const engine=DatabaseInstanceEngine.sqlServerWeb({ version: SqlServerEngineVersion.VER_15_00_4236_7_V1 } );
    const instanceType = InstanceType.of(InstanceClass.T3,InstanceSize.SMALL);
    const port=1433;
    const dbName="srv4devapi";

    const masterUserSecret  =   new Secret ( this,"db-master-user-secret",{
      secretName:"db-master-user-secret",
      description:"User secret for Db SerApiv",
      generateSecretString:
      {
         secretStringTemplate: JSON.stringify({username:"admin"}),
         generateStringKey:"password",
         passwordLength:10,
         excludePunctuation:true,
       },
       } );
    
       const myVpc=Vpc.fromLookup(this,"S4D-VPC",{vpcId:"vpc-0f96cfacc96e4828a"});
  
       const dbSecurityGroup= new SecurityGroup(this,"MS SQl Database",{
         securityGroupName: "Database SQl",
         vpc: myVpc,
       });
       dbSecurityGroup.addIngressRule(Peer.ipv4(myVpc.vpcCidrBlock),
       Port.tcp(port));


       const dbInstance= new DatabaseInstance(this,"DB-1",{
         vpc: myVpc,
         vpcSubnets: { subnetType: SubnetType.PRIVATE_ISOLATED},
         instanceType,
         engine,
         port,
         securityGroups: [dbSecurityGroup],
         databaseName: dbName,
         credentials: Credentials.fromSecret(masterUserSecret),
         backupRetention: Duration.days(0),
         deleteAutomatedBackups: true,
         removalPolicy: RemovalPolicy.DESTROY,
       });
     //  masterUserSecret.attach(dbInstance);


    }    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SqlsrdevapivQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
 }


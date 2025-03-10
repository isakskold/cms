# Serverless project

This serverless directory defines cloud functions and configurations for the AWS environment. Following services are used in this project:

- **Lambda** - Cloud functions that allow you to run backend code without provisioning or managing servers.
- **IAM** - Identity and Access Management. Controls access to AWS resources by defining permissions and roles for users, services, and applications.
- **DynamoDB** - A fully managed NoSQL database service that provides fast and predictable performance.
- **API Gateway** - A managed service for creating, publishing, maintaining, monitoring, and securing APIs.
- **CloudWatch** - A monitoring and logging service for AWS resources and applications.
- **Cognito** - A service for managing user authentication and authorization.
- **ElastiCache** - A fully managed in-memory cache service that helps reduce the load on databases by caching frequently accessed data, improving application performance and scalability. I am using Redis as engine.

## Handlers

Cloud functions are defined in this directory

## serverless.yml

The serverless project configuration is made here. It defines api endpoints, resources and where to use the handler functions.

## Authentication, Authorization - Cognito

This project uses the AWS service Cognito to manage users. It removes a lot of the manual configuration for basic security.

When a user signs up, a user is created both in cognito, and in dynamodb. The user item in the userTable has an attribute named cognitoUserSub, this is the users unique identifier. We can use that to make sure the cognito user is accessing the correct item in userTable.

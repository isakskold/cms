# Content Management System, for portfolio websites

A content management system application, used to managa portfolio data.

## Use case

This application is a tool to manage portfolio-related data such as projects, descriptions, images, skills, etc. The data is stored in the cloud, and the user of this application has to make their own API requests to fetch their data to their portfolio websites. The purpose of this application is to have a centralized environment for your portfolio data. This tool makes it easier to migrate to a new portfolio website without having to rewrite the data in the client; simply make the same HTTP request.

## nextjs and serverless

This is a mono repo. The `nextjs/` directory is a Next.js frontend application, `serverless/` contains cloud functions and is built with AWS.

## How to connect this CMS to your own portfolio

coming soon...  

## Authentication with Cognito and Cookies

Project uses the aws service `Cognito` to manage users. It stores users and handles generating tokens. In order to make it secure, I do not handle the refresh token client side. As you can see in the flow below, only the access token is stored client side, while refresh token is set as a httpOnly cookie in the backend.

- User logs in
- Cognito responds with a "code" in the URL
- Client extracts the code string and sends the code to a lambda function
- Lambda function uses the code string to exchange it for tokens from cognito
- Lambda function sets the refresh token as a cookie for the client that made the request
- Lambda function sends the access token to the client
- Client stores and uses the access token to make requests
- When access token expires, client calls /users/refreshToken to generate a new access token
- The httpOnly cookie with refresh token is being included in request
- If the refresh token from cookie is valid, the lambda function will return the new access token to the client
- If refresh token fails, user will be logged out.

## Zustand as "cache"

In this project I have been researching how to use a cache to reduce reads on the database. I started out by using ElastiCache in AWS. I liked it. I had lots of freedoom to customize the cache logic within my lambda functions. The drawback however, I needed to keep the lambda handlers inside a VPC that held the ElastiCache instance. This cuts of internet access for my lambda handlers, and that did not work for me. My lambda functions need internet access, for example to connect to cognito.

I switched into DAX, which is the standard cache service for DynamoDB. Before I had started implementing it I realised, why not just use zustand?

In this project, users will only fetch their own data, and no one else can modify their data. This allows me to read from the zustand state if it exists, instead of reading from the database. Since the users data are not that big, this setup should work and act as a "cache". I realised it might be better to just scrap using a cache service, while taking advantage of Zustand.

The client will only read from DynamoDB if the user data does not exist. Logging out is an action that resets the user data. So when a user logs in, it will fetch from DynamoDB, but then it will fetch directly from Zustand, until a new login session begins.

Any updates to DynamoDB will also be reflected directly in Zustand. This makes sure the database and zustand is in sync, since I perform the same operations on both. That removes the need to fetch more than once per login session.

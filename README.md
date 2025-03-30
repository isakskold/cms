# Content Management System, for portfolio websites

A content management system application, used to managa portfolio data.

## How to use the application

- In your browser, enter `https://cms-ten-snowy.vercel.app/`
- Click on `Login/Sign Up`
- Login with an existing account, or create a new account
- After successfull login, user will be navigated to the dashboard page
- In the dashboard page, click `New Project`
- Fill in the fields with relevant data. Every field takes a string value
- To discard unsaved changes, click on the `Discard` button
- To save the project, click on the `Save` button
- User will be redirected to the dashboard after saving the project
- The new project should now be visible in the dashboard
- User can click on the project to edit or delete it. Same save and discard options as before, but now there is also an `Delete` button that removes the project

## Use case

This application is a tool to manage portfolio-related data such as projects, descriptions, images, skills, etc. The data is stored in the cloud, and the user of this application has to make their own API requests to fetch their data to their portfolio websites. The purpose of this application is to have a centralized environment for your portfolio data. This tool makes it easier to migrate to a new portfolio website without having to rewrite the data in the client; simply make the same HTTP request.

## nextjs and serverless

This is a mono repo. The `nextjs/` directory is a Next.js frontend application, `serverless/` contains cloud functions and is built with AWS.

## How to connect this CMS to your own portfolio

In order to fetch the user data and use it in a portfolio application, do the following:

- In the CMS application, navigate to settings page
- Select fetch api key
- Copy the API key
- Make a GET request to `https://2upf63jpgg.execute-api.eu-north-1.amazonaws.com/public`
- Include your email in the `x-user-email` header
- Include your copied API Key in the `x-api-key` header
- Extract the data from the response that you want to use in your portfolio

To keep your API key secure, do not expose your API in your client. Instead, create a server request file in Next.js that makes this request. Let your frontend call your server request file, then let the server make the request defined above. This will make sure your API Key stays hidden.

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

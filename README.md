# Content Management System, for portfolio websites

A content management system application, used to managa portfolio data.

## Use case

This application is a tool to manage portfolio-related data such as projects, descriptions, images, skills, etc. The data is stored in the cloud, and the user of this application has to make their own API requests to fetch their data to their portfolio websites. The purpose of this application is to have a centralized environment for your portfolio data. This tool makes it easier to migrate to a new portfolio website without having to rewrite the data in the client; simply make the same HTTP request.

## nextjs and serverless

This is a mono repo. The `nextjs/` directory is a Next.js frontend application, `serverless/` contains cloud functions and is built with AWS.

## How to connect this CMS to your own portfolio

coming soon...

## Zustand and cache for user data

I have spent time setting up an efficient way of retrieving user data that does not need to send a GET request to DynamoDB every time the data is needed. There are 3 layers to this.

- Zustand
- Cache (DAX)
- DynamoDB

In the client we store user data in Zustand (which is a state management tool). Zustand uses the `persist` middleware, which syncs the data to localstorage. Syncing the data to local storage means that the state will persist across page reloads.

Instead of making the http request, we try to fetch from the zustand state. If the zustand state is null, then make the http request. The Zustand state will be null when a user has logged out for example.

When making POST request to add project or update project we also run a zustand function that adds the project to the state too. This way we make sure that any changes that are being sent to the database is also updated clientside in the Zustand store.

When a http fetch has to be made, it will go to the lambda handler. This handler will use DAX, which is a cache service for DynamoDB. DAX automatically handles the caching logic. Meaning that actual database reads will be very minimal.

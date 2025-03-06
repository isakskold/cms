# Serverless project

This serverless directory defines cloud functions used in AWS.

## Handlers

Cloud functions are defined in this directory

## serverless.yml

The serverless project configuration is made here. It defines api endpoints, resources and where to use the handler functions.

## Cache logic
To reduce database reads I am using ElastiCache with redis as engine.  
Initial fetch will fetch directly from the database. This fetch saves the data to the cache. When the next request is called, it checks if the caller has an existing cache, if so, it uses that data.
In order to fetch updated data from the database, I simply clear the users cache whenever they make a create, update or delete request. When the user makes the next fetch, the user will recieve data from the database again, and a new cache is set to represent the latast data.



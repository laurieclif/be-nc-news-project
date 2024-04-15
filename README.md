# Northcoders News API

what files a developer must add in order to successfully connect to the two databases locally
In order to run this project locally, you will need to create:

- A .env.test file, with PGDATABASE = nc_news_test
- A .env.development file, with PGDATABASE = nc_news

dependencies:
- express
- postgres

dev dependencies:
- supertest
- jest
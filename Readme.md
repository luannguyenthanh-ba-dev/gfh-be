# NestJS GraphQL API Project

A NestJS TypeScript starter repository with GraphQL implementation.

## Description
This project is built with NestJS framework and includes GraphQL, TypeORM, and various other features for building a robust API service.

## Prerequisites
- Node.js
- PostgreSQL
- npm/yarn

## Installation
```bash
$ npm install
```

## Environment Configuration

This project uses a two-level environment configuration:

### 1. Root Environment (`.env`)
Create a `.env` file in the root directory to specify which environment to use:

```env
environment=development
#environment=production
#environment=uat
```

### 2. Environment-Specific Configuration (`environments/*.env`)
Create environment-specific files in the `environments` directory:

#### Development Configuration (`environments/development.env`)
```env
# Server Configuration
PORT=3006

# Database Configuration
POSTGRESQL_HOST=localhost
POSTGRESQL_PORT=5432
POSTGRESQL_USER=your_username
POSTGRESQL_PASSWORD=your_password
POSTGRESQL_DATABASE=your_database

# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your_client_id
AUTH0_CLIENT_SECRET=your_client_secret
AUTH0_AUDIENCE=your_api_audience
AUTH0_DEFAULT_CONNECTION=Username-Password-Authentication
```

Similarly, you can create `production.env` and `uat.env` in the environments directory for different environments.

### Environment Variables Description

#### Root Environment
- `environment`: Specifies which environment configuration to load (development/production/uat)

#### Environment-Specific Variables

#### Server
- `PORT`: Application port (default: 3006)

#### Database
- `POSTGRESQL_HOST`: PostgreSQL database host
- `POSTGRESQL_PORT`: PostgreSQL database port
- `POSTGRESQL_USER`: Database user
- `POSTGRESQL_PASSWORD`: Database password
- `POSTGRESQL_DATABASE`: Database name

#### Auth0
- `AUTH0_DOMAIN`: Your Auth0 tenant domain
- `AUTH0_CLIENT_ID`: Auth0 application client ID
- `AUTH0_CLIENT_SECRET`: Auth0 application client secret
- `AUTH0_AUDIENCE`: API audience defined in Auth0
- `AUTH0_DEFAULT_CONNECTION`: Auth0 database connection name

### Setup Instructions
1. Copy `.env.example` to `.env` and select your environment
2. Copy `environments/development.env.example` to `environments/development.env`
3. Update the environment-specific variables according to your setup
4. For production or UAT, create corresponding env files with appropriate values

### Security Note
- Never commit actual environment files (`.env` or `*.env`) to version control
- Keep sensitive credentials secure and only share through proper channels
- Consider using secret management services in production

## Running the app
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov

# debug tests
$ npm run test:debug
```

## Code Quality
```bash
# format code
$ npm run format

# lint code
$ npm run lint
```

## Main Dependencies
- NestJS v11.0.11
- Apollo Server v4.11.3
- GraphQL v16.10.0
- TypeORM
- PostgreSQL
- Class Validator & Transformer
- RxJS v7.8.2

## Development Dependencies
- TypeScript v5.7.3
- ESLint v9.21.0
- Prettier v3.5.3
- Jest v29.7.0

## License
This project is licensed under the MIT License.

## Author
Louis Nguyen

## Version
1.0.0
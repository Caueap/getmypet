<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# GetMyPet API

A NestJS-based REST API for a pet adoption platform. This backend service manages users, pets, and adoption applications.

## Features

- **User Management**: Registration, authentication, and profile management
- **Pet Management**: CRUD operations for pets with filtering capabilities
- **Adoption System**: Application submission and management workflow
- **Authentication**: JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM

## Tech Stack

- **Framework**: NestJS
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Validation**: class-validator
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/getmypet
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

4. Start MongoDB (make sure MongoDB is running on your system)

5. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create a new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Soft delete user

### Pets
- `GET /pets` - Get all pets (with optional filters: species, size, location, status)
- `GET /pets/available` - Get available pets for adoption
- `GET /pets/owner/:ownerId` - Get pets by owner
- `GET /pets/:id` - Get pet by ID
- `POST /pets` - Create a new pet
- `PATCH /pets/:id` - Update pet
- `PATCH /pets/:id/adopt/:adopterId` - Mark pet as adopted
- `DELETE /pets/:id` - Soft delete pet

### Adoptions
- `GET /adoptions` - Get all adoption applications
- `GET /adoptions/statistics` - Get adoption statistics
- `GET /adoptions/applicant/:applicantId` - Get applications by applicant
- `GET /adoptions/owner/:ownerId` - Get applications by pet owner
- `GET /adoptions/pet/:petId` - Get applications for a specific pet
- `GET /adoptions/:id` - Get adoption application by ID
- `POST /adoptions` - Create adoption application
- `PATCH /adoptions/:id` - Update adoption application status
- `DELETE /adoptions/:id` - Soft delete adoption application

## Data Models

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role: string; // default: 'user'
  isActive: boolean; // default: true
}
```

### Pet
```typescript
{
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed?: string;
  size: 'small' | 'medium' | 'large';
  age: number;
  gender: 'male' | 'female';
  description: string;
  images: string[];
  status: 'available' | 'adopted' | 'pending';
  vaccinations: string[];
  isNeutered: boolean;
  location?: string;
  ownerId: ObjectId; // Reference to User
  adoptedBy?: ObjectId; // Reference to User
  adoptedAt?: Date;
  isActive: boolean; // default: true
}
```

### Adoption
```typescript
{
  petId: ObjectId; // Reference to Pet
  applicantId: ObjectId; // Reference to User
  ownerId: ObjectId; // Reference to User
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  message: string;
  ownerNotes?: string;
  applicationDate: Date;
  responseDate?: Date;
  completionDate?: Date;
  isActive: boolean; // default: true
}
```

## Example Usage

### Register a new user
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "city": "New York"
  }'
```

### Create a new pet
```bash
curl -X POST http://localhost:3000/pets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Buddy",
    "species": "dog",
    "breed": "Golden Retriever",
    "size": "large",
    "age": 3,
    "gender": "male",
    "description": "Friendly and energetic dog",
    "location": "New York",
    "ownerId": "USER_ID_HERE"
  }'
```

### Submit adoption application
```bash
curl -X POST http://localhost:3000/adoptions \
  -H "Content-Type: application/json" \
  -d '{
    "petId": "PET_ID_HERE",
    "applicantId": "APPLICANT_ID_HERE",
    "ownerId": "OWNER_ID_HERE",
    "message": "I would love to adopt this pet!"
  }'
```

## Development

```bash
# Watch mode
npm run start:dev

# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Lint
npm run lint

# Format code
npm run format
```

## License

This project is licensed under the UNLICENSED License.

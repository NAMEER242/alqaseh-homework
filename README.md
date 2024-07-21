# Auth Management Service

## Overview

The Auth Management Service is responsible for handling authentication and authorization for your application. It provides functionalities such as user authentication, role-based access control, and service-to-service authentication.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [User Authentication](#user-authentication)
  - [Service Authentication](#service-authentication)
- [Integration](#integration)
  - [Environment Configuration](#environment-configuration)
  - [Sync Microservice Data and Roles](#sync-microservice-data-and-roles)
  - [Controller Authorization](#controller-authorization)

## Prerequisites

Before using the Auth Management Service, ensure you have the following installed:

- Node.js and npm
- MySQL or another supported database
- Nest.js CLI (optional but recommended for development)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd auth-management-service
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Set up the database configuration in `config/database.config.ts` and other configuration details in `.env` file.

## Configuration

Configure the service by setting up environment variables in the `.env` file. Define values for `SERVICE_NAME`, `SERVICE_ROLE_API_KEY`, and `AUTH_MANAGEMENT_SERVICE_DOMAIN`.

```env
# Service role options:
SERVICE_NAME=your-service-name
SERVICE_ROLE_API_KEY=your-api-key
AUTH_MANAGEMENT_SERVICE_DOMAIN=http://auth-management-service-url
```

## Usage

### User Authentication

For user authentication, use the provided endpoints for signup, login, logout, and profile management. Refer to the Swagger documentation for detailed API information.

```bash
# Start the service
npm run start:dev
```

### Service Authentication

Service authentication involves interacting with the Auth Management Service for validation and synchronization of roles.

## Integration

Integrating the Auth Management Service into another microservice involves four main steps:

### Environment Configuration

Define the Auth Management Service environment configuration and fetch it using the following code:

```typescript
// src/config/service-auth-config.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceAuthConfig {
  constructor(private readonly configService: ConfigService) {}

  get getApiKey(): string {
    return this.configService.get<string>('SERVICE_ROLE_API_KEY');
  }

  get getAuthManagementServiceDomain(): string {
    return this.configService.get<string>('AUTH_MANAGEMENT_SERVICE_DOMAIN');
  }

  get getServiceName(): string {
    return this.configService.get<string>('SERVICE_NAME');
  }
}
```

### Sync Microservice Data and Roles

Utilize the `ServiceRoleInitializer` utility to synchronize local roles with the role system:

```typescript
// common/utils/service-role-initializer.ts

import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { INestApplication, InternalServerErrorException, Logger } from '@nestjs/common';
import { ServiceAuthConfig } from '../modules/myconfig/services/service-auth-config.service';

export class ServiceRoleInitializer {
  // ... (as provided in your implementation)
}

// Usage example in your microservice:
const app = await NestFactory.create(AppModule);
const roleInitializer = new ServiceRoleInitializer(app);
await roleInitializer.run();
```

The `Initializer` is used to sync other service roles and unique names, the code for this `ServiceRoleInitializer` can be found [here](https://github.com/TurathAlanbiaaIT/auth-management-service/blob/main/src/common/utils/service-role-initializer.ts).

### Authentication Module

You will need to define an interceptor that is used to authorize coming requests.

we already defined a base interceptor with its service provider that can be found [here](https://github.com/TurathAlanbiaaIT/auth-management-service/tree/main/src/modules/auxiliary/authentication/core) in the core folder inside the `AuthModule`, now you need to define an auxiliary interceptor with its serverProvider that represent the authorization that you want to apply on a controller.

This can be done by defining the service provider for the authorization interceptor:

```typescript
// src/modules/authentication/auxiliary/adminAuth/providers/admin.provider.ts
import { Injectable } from '@nestjs/common';
import { AuthenticationServiceProvider } from '../../../core/providers/authentication.provider';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ServiceAuthConfig } from '../../../../myconfig/services/service-auth-config.service';

@Injectable()
export class AdminServiceProvider extends AuthenticationServiceProvider {
  constructor(
    private readonly configService: ServiceAuthConfig,
    protected readonly httpService: HttpService,
  ) {
    super();
  }

  getValidateFunction(
    roles: string[],
  ): (req: Request) => Observable<AxiosResponse<any>> {
    const apiKey = this.configService.getApiKey;
    const authUrl = this.configService.getAuthManagementServiceDomain;

    return (req: Request) =>
      this.httpService.get(`${authUrl}/service-auth/account/validate-roles`, {
        headers: {
          'api-key': apiKey,
          Authorization: req.headers.authorization,
        },
        params: { roles: roles },
      });
  }
}
```

then we can define the authorization interceptor, we will do that by creating a function that takes the required input and return the interceptor to be used on the controller:

```typescript
// src/modules/authentication/auxiliary/adminAuth/providers/admin.interceptor.ts
import { Injectable } from '@nestjs/common';
import { AuthenticationInterceptor } from '../../../core/providers/authentication.interceptor';
import { AdminServiceProvider } from './admin.provider';
import { ServiceRoleInitializer } from '../../../../../common/utils/service-role-initializer';

export function adminAuthInterceptor(...roles: string[]) {
  ServiceRoleInitializer.addRoles(...roles);
  @Injectable()
  class AdminInterceptor extends AuthenticationInterceptor {
    constructor(readonly authService: AdminServiceProvider) {
      super();
    }

    validateFunction = this.authService.getValidateFunction(roles);
  }

  return AdminInterceptor;
}
```

finally we can use this function to apply interceptor for some controller:

```typescript
// src/modules/your-module/controllers/your-controller.controller.ts

@Controller('books')
export class BooksController {

  @Post()
  @UseInterceptors(adminAuthInterceptor('book::create'))
  async create(@Body() bookDto: CreateBookDto) {
    // Your controller logic
  }
}
```

### Controller Authorization

Authorize a user before using any controller by applying the `adminAuthInterceptor`:

```typescript
// src/modules/your-module/controllers/your-controller.controller.ts

import { Controller, Post, Body, UsePipes, UseInterceptors } from '@nestjs/common';
import { JoiValidatorPipe } from '../common/pipes/joi-validator.pipe';
import { adminAuthInterceptor } from '../authentication/providers/admin.interceptor';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {

  @Post()
  @UsePipes(new JoiValidatorPipe(createBookValidationSchema))
  @UseInterceptors(adminAuthInterceptor('book::create'))
  async create(@Body() bookDto: CreateBookDto) {
    // Your controller logic
  }
}
```

> For API documentation, refer to the Swagger documentation provided by the Auth Management Service.

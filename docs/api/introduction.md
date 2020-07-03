# Introduction

Whispr offers two APIs: GraphQL and REST. You are highly encouraged to use GraphQL API but
in case you can't you still have the REST API available.

## Input file

The payload you have to provide for both GraphQL and REST endpoints is described in the 
`entityName.input.ts` file.

Example: 
```javascript
import { Field } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

export class WhispInputType  {
  @Field(() => String, { nullable: true }) // GraphQL annotations
  @IsString() @IsOptional() // class-validator annotations, used by Nest Validation Pipe
  _id: string;
}
``` 

- GraphQL annotations are needed by graphql to describe the endpoint.

- class-validator annotations are used to validate REST payloads.

**Note**: class-validator will also validate GraphQL payloads, but since the GraphQL validation
happens before class-validator validation, and the rules should be the same, class-validator
validation should always pass.

**Warning**: we use Nest validation pipe with whitelist option enabled. Therefore you
must provide a class-validator annotation on fields you want to add, or they will
be automatically removed by the validation pipe.  

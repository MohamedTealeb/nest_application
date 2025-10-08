import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  constructor(private schema: ZodType<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if (value.password !== value.ConfirmPassword) {
      throw new BadRequestException('Password not match');
    }

    const { error, success } = this.schema.safeParse(value);

    if (!success) {
      throw new BadRequestException({
        message: 'Validation failed',
        issues: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
    }

    return value;
  }
}

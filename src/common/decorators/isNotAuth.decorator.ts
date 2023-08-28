import { SetMetadata } from '@nestjs/common';

export const IsNotAuth = () => SetMetadata('isNotAuth', true);

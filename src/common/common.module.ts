import { Module } from '@nestjs/common';
import { DatabaseModule } from '@common/database/database.module';
import { CloudinaryModule } from '@common/cloudinary/cloudinary.module';
import { RepositoryModule } from './repository/repository.module';
@Module({
    imports: [DatabaseModule, CloudinaryModule, RepositoryModule],
    controllers: [],
})
export class CommonModule { }

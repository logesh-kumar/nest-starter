import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TasksController } from './tasks/tasks.controller';
import { AppGateway } from './app.gateway';

@Module({
  imports: [TasksModule, TypeOrmModule.forRoot(typeOrmConfig), AuthModule],
  providers: [AppGateway],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ method: RequestMethod.POST, path: 'tasks' })
      .forRoutes(TasksController);
  }
}

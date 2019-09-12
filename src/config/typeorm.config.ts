import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
const dbConfig = config.get('db');
const ENV = process.env;
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: ENV.DB_HOST_NAME || dbConfig.host,
  port: ENV.DB_PORT || dbConfig.port,
  username: ENV.DB_USERNAME || dbConfig.username,
  password: ENV.DB_PASSWORD || dbConfig.password,
  database: ENV.DB_NAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  /**
   * Indicates if database schema should be auto created on every application launch.
   * Be careful with this option and don't use this in production - otherwise you can lose production data.
   * This option is useful during debug and development.
   * Alternative to it, you can use CLI and run schema:sync command.
   *
   * Note that for MongoDB database it does not create schema, because MongoDB is schemaless.
   * Instead, it syncs just by creating indices.
   */
  synchronize: ENV.TYPEORM_SYNC || dbConfig.synchronize,
};

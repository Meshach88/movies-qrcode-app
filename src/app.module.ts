import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Movie } from './movies/movie.entity';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ?  parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'tams',
      database: process.env.DB_NAME || 'moviesdb',
      entities: [Movie],
      autoLoadEntities: true,
      synchronize: false,
    }),
    MoviesModule,
  ],
})
export class AppModule {}











// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { MoviesModule } from './movies/movies.module';

// @Module({
//   imports: [MoviesModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}

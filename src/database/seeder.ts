import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { Movie } from '../movies/movie.entity';
import * as fs from 'fs';
import * as path from 'path';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const movieRepository = dataSource.getRepository(Movie);

  // Read JSON file
  const filePath = path.join(__dirname, 'movies.json');
  const movieData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(movieData)) {
    console.error('❌ Invalid JSON format: Expected an array');
    process.exit(1);
  }

  // Insert movies into the database
  await movieRepository.insert(movieData);

  console.log('✅ Movies seeded successfully from JSON file!');
  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

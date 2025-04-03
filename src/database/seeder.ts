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

  // Adjust file path for production deployment
  const filePath = path.join(__dirname, 'movies.json');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('❌ movies.json file not found in:', filePath);
    process.exit(1);
  }

  const movieData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!Array.isArray(movieData)) {
    console.error('❌ Invalid JSON format: Expected an array');
    process.exit(1);
  }

  // Insert only required fields (id, title, image)
  const formattedMovies = movieData.map(movie => ({
    title: movie.title,
    image: movie.image
  }));

  await movieRepository.insert(formattedMovies);

  console.log('✅ Movies seeded successfully from JSON file!');
  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

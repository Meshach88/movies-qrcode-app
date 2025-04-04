import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MoviesService implements OnModuleInit {

    constructor(
        @InjectRepository(Movie)
        private readonly movieRepository: Repository<Movie>,
    ) { }

    // Fetch 10 random movies
    async getRandomMovies(): Promise<Movie[]> {
        return this.movieRepository
            .createQueryBuilder('movie')
            .orderBy('RANDOM()')
            .limit(10)
            .getMany();
    }
    // Store movies for a token
    private movieCache = new Map<string, Movie[]>();
    
    async onModuleInit() {
        await this.generateQRCode();

        setInterval(async () => {
            await this.generateQRCode();
            // console.log('QR code and movie list regenerated.');
        }, 10000);
    }

    async generateQRCode(): Promise<{ token: string; url: string }> {
        const token = uuidv4();
        const movies = await this.getRandomMovies();

        // Store the movies with the token
        this.movieCache.set(token, movies);

        const url = `https://movies-qrcode-api.onrender.com/movies/${token}`;
        return { token, url };
    }

    // Retrieve movies by token
    getMoviesByToken(token: string): Movie[] | null {
        return this.movieCache.get(token) || null;
    }

}

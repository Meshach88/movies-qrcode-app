import { Controller, Get, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import * as QRCode from 'qrcode';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // Generate QR code
  @Get('qrcode')
  async getQRCode() {
    const { token, url } = await this.moviesService.generateQRCode();
    const qrCodeDataUrl = await QRCode.toDataURL(url); // Convert to a QR Image
    return { qrCode: qrCodeDataUrl, token, url };
  }
  
  //Fetch movies based on token
  @Get(':token')
  getMovies(@Param('token') token: string) {
    const movies = this.moviesService.getMoviesByToken(token);
    if(!movies) {
        return { message: 'Invalid or expired token', status: 404};
    }
    return { movies };
  }
}

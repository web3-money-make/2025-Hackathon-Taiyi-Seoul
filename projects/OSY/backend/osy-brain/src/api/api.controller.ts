import { Response } from 'express';

import { Controller, Get, Query, Res } from '@nestjs/common';

import { ApiService } from './api.service';
import { HistoryRequestDto } from './dto';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('/path')
  async getPath(@Res() res: Response): Promise<void> {
    const pool = await this.apiService.getPath();
    res.status(200).
    json(pool);
  }

  @Get('/apy-history')
  async getApyHistory(@Res() res: Response, @Query() query: HistoryRequestDto): Promise<void> {
    const history = await this.apiService.getApyHistory(query);
    res.status(200).json(history);
  }

  @Get('/rebalance-history')
  async getRebalanceHistory(@Res() res: Response, @Query() query: HistoryRequestDto): Promise<void> {
    const history = await this.apiService.getRebalanceHistory(query);
    res.status(200).json(history);
  }
}

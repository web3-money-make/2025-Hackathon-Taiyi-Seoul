import {
  defineCollection, IApyHistoryModel, IPoolModel, IRebalanceHistoryModel
} from 'src/db';

import { Injectable } from '@nestjs/common';

import { HistoryRequestDto } from './dto';

@Injectable()
export class ApiService {
  async getPath(): Promise<IPoolModel> {
    const db = await defineCollection();
    const pools = await db.collection.pool.find({}, { _id: 0, __v: 0 }).sort({ apy: -1 }).limit(1);
    return pools[0];
  }

  async getApyHistory(query: HistoryRequestDto): Promise<IApyHistoryModel[]> {
    const db = await defineCollection();
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: Record<string, any> = {};
    if (query.chainId !== undefined) {
      filter.chainId = query.chainId;
    }
    if (query.protocolId !== undefined) {
      filter.protocolId = query.protocolId;
    }

    const history = await db.collection.apyHistory.find(
      filter,
      { _id: 0, __v: 0 }
    )
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return history;
  }


  async getRebalanceHistory(query: HistoryRequestDto): Promise<IRebalanceHistoryModel[]> {
    const db = await defineCollection();
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const filter: Record<string, any> = {};
    if (query.chainId !== undefined) {
      filter.chainId = query.chainId;
    }
    if (query.protocolId !== undefined) {
      filter.protocolId = query.protocolId;
    }
    const history = await db.collection.rebalanceHistory.find(
      filter,
      { _id: 0, __v: 0 }
    )
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return history;
  }
}

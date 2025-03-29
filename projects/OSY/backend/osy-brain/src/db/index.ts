import * as dotenv from 'dotenv';
import mongoose, { model } from 'mongoose';

import { IMongoCollection } from './collection';
import {
  ApyHistorySchema, IApyHistoryModel, INetworkModel, IPoolModel,
  IRebalanceHistoryModel, ISyncModel, IVaultModel, NetworkSchema, PoolSchema,
  RebalanceHistorySchema, SyncSchema, VaultSchema
} from './models';

let isInitialized = false;
let cachedConnection: mongoose.Connection | null = null;
let cachedCollection: IMongoCollection | null = null;

dotenv.config();

async function createConnection(): Promise<mongoose.Connection> {
  if(cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);

  let uri = '';
  if (password) {
    uri = `mongodb+srv://osy:${password}@osy.wkwpv.mongodb.net/?retryWrites=true&w=majority&appName=osy/OSY`;
  }

  try {
    const connection = await mongoose.connect(uri)
    cachedConnection = connection.connection;
    return cachedConnection;
  } catch (err) {
    throw new Error(`MongoDB connection error: ${err}`);
  }
}

async function defineCollection(): Promise<{
  connection: mongoose.Connection;
  collection: IMongoCollection;
}> {
  const connection = await createConnection();
  if (isInitialized && cachedCollection) {
    return { connection, collection: cachedCollection };
  }

  const rebalanceHistoryModel = model<IRebalanceHistoryModel>('RebalanceHistory', RebalanceHistorySchema, 'RebalanceHistory', { connection });
  const apyHistoryModel = model<IApyHistoryModel>('ApyHistory', ApyHistorySchema, 'ApyHistory', { connection });
  const poolModel = model<IPoolModel>('Pool', PoolSchema, 'Pool', { connection });
  const networkModel = model<INetworkModel>('Network', NetworkSchema, 'Network', { connection });
  const vaultModel = model<IVaultModel>('Vault', VaultSchema, 'Vault', { connection });
  const syncModel = model<ISyncModel>('Sync', SyncSchema, 'Sync', { connection });
  const collection: IMongoCollection = {
    rebalanceHistory: rebalanceHistoryModel,
    apyHistory: apyHistoryModel,
    pool: poolModel,
    network: networkModel,
    vault: vaultModel,
    sync: syncModel,
  };


  cachedCollection = collection;
  isInitialized = true;

  return { connection, collection };
}

export {
    defineCollection,
    IRebalanceHistoryModel,
    IApyHistoryModel,
    IPoolModel,
    INetworkModel,
    IVaultModel,
    ISyncModel
};
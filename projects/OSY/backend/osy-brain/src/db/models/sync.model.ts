import { Schema } from 'mongoose';

interface ISyncModel {
    chainId: number;
    blockNumber: number;
    timestamp: number;
}

const SyncSchema = new Schema<ISyncModel>({
    chainId: { type: Number, required: true },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Number, required: true },
});

export { ISyncModel, SyncSchema };
import { Schema } from 'mongoose';

interface IApyHistoryModel {
    protocolId: number;
    chainId: number;
    apy: number;
    timestamp: number;
}


const ApyHistorySchema = new Schema<IApyHistoryModel>({
    protocolId: { type: Number, required: true },
    chainId: { type: Number, required: true },
    apy: { type: Number, required: true },
    timestamp: { type: Number, required: true },
})

export { IApyHistoryModel, ApyHistorySchema }
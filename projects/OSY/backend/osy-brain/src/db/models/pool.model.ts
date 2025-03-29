import { Schema } from 'mongoose';

interface IPoolModel {
    protocolId: number;
    chainId: number;
    project: string;
    symbol: string;
    apy: number;
}


const PoolSchema = new Schema<IPoolModel>({
    protocolId: { type: Number, required: true },
    chainId: { type: Number, required: true },
    project: { type: String, required: true },
    symbol: { type: String, required: true },
    apy: { type: Number }
})

export { IPoolModel, PoolSchema }
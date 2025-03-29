import { Schema } from 'mongoose';

interface IRebalanceHistoryModel {
    txHash: string;
    srcChainId: number;
    dstChainId: number;
    srcProtocolId: number;
    dstProtocolId: number;
    amount: number;
    improvementApy: number;
    timestamp: number;
}


const RebalanceHistorySchema = new Schema<IRebalanceHistoryModel>({
    txHash: { type: String, required: true },
    srcChainId: { type: Number, required: true },
    dstChainId: { type: Number, required: true },
    srcProtocolId: { type: Number, required: true },
    dstProtocolId: { type: Number, required: true },
    amount: { type: Number, required: true },
    improvementApy: { type: Number, required: true },
    timestamp: { type: Number, required: true },
})

export { IRebalanceHistoryModel, RebalanceHistorySchema }
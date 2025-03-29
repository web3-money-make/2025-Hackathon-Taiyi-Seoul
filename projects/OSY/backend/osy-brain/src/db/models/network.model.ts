import { Schema } from 'mongoose';

interface INetworkModel {
    chainId: number;
    rpc: string;
}

const NetworkSchema = new Schema<INetworkModel>({
    chainId: { type: Number, required: true },
    rpc: { type: String, required: true },
})

export { INetworkModel, NetworkSchema };
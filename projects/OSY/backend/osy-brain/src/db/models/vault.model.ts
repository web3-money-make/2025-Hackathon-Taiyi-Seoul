import { Schema } from 'mongoose';

interface IVaultModel {
    address: string;
    chainId: number;
    isMain: boolean;
}


const VaultSchema = new Schema<IVaultModel>({
    address: { type: String, required: true },
    chainId: { type: Number, required: true },
    isMain: { type: Boolean, required: true },
});

export { IVaultModel, VaultSchema };

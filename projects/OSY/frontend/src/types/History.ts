export type PositionLocation = {
  chain: number;
  dex: number;
};

type History = {
  txHash: string;
  from: PositionLocation;
  to: PositionLocation;
  amount: string;
  time: number;
};

export default History;

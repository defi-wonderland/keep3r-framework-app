import { Hex, Address } from 'viem';

export interface VaultData {
  address: Address;
  chain: string;
  owner: Address | undefined;
  name: string | undefined;
  relays: RelayData;
  jobs: JobData;
  tokens: TokenData[];
  totalValue: string;
}

export interface RelayData {
  [relayAddress: string]: Address[];
}

export interface JobData {
  [jobAddress: string]: string[];
}

export interface SelectedItem {
  type: string;
  address: Address;
  params: Hex[];
}

export interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  balanceE18: string;
  balance: string;
  address: string;
  price: string;
  balanceUSD: string;
}

export type OptionsType = 'vault' | 'job' | 'relay';

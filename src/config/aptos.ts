import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

// 配置 Aptos 网络（使用测试网）
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

// 合约地址（需要替换为实际部署的合约地址）
export const MODULE_ADDRESS = '0x1'; // TODO: 替换为实际合约地址
export const MODULE_NAME = 'cutemarket';


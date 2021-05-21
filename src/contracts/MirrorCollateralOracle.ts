import {
  AccAddress,
  Coins,
  MsgInstantiateContract,
  MsgExecuteContract,
  Numeric,
  Dec
} from '@terra-money/terra.js';
import { AssetInfo } from '../utils/Asset';
import { ContractClient } from './ContractClient';
import { EmptyObject } from '../utils/EmptyObject';

export namespace MirrorCollateralOracle {
  export interface InitMsg {
    owner: AccAddress;
    mint_contract: AccAddress;
    factory_contract: AccAddress;
    base_denom: string;
  }

  export interface HandleUpdateConfig {
    update_config: {
      owner?: AccAddress;
      mint_contract?: AccAddress;
      factory_contract?: AccAddress;
      base_denom?: string;
    };
  }

  export interface TerraOracle {
    terra_oracle: {
      terra_oracle_query: string;
    };
  }
  export interface Terraswap {
    terraswap: {
      terraswap_query: string;
    };
  }
  export interface BandOracle {
    band_oracle: {
      band_oracle_query: string;
    };
  }
  export interface FixedPrice {
    fixed_price: {
      price: string;
    };
  }
  export type SourceType = TerraOracle | Terraswap | BandOracle | FixedPrice;

  export interface HandleRegisterCollateralAsset {
    register_collateral_asset: {
      asset: AssetInfo;
      price_source: SourceType;
      collateral_premium: string;
    };
  }

  export interface HandleRevokeCollateralAsset {
    revoke_collateral_asset: {
      asset: AssetInfo;
    };
  }

  export interface HandleUpdateCollateralPriceSource {
    update_collateral_price_source: {
      asset: AssetInfo;
      price_source: SourceType;
    };
  }

  export interface HandleUpdateCollateralPremium {
    update_collateral_premium: {
      asset: AssetInfo;
      collateral_premium: string;
    };
  }

  export interface QueryConfig {
    config: EmptyObject;
  }

  export interface QueryCollateralPrice {
    collateral_price: {
      asset: string;
    };
  }

  export interface QueryCollateralAssetInfo {
    collateral_asset_info: {
      asset: string;
    };
  }

  export interface QueryCollateralAssetInfos {
    collateral_asset_infos: EmptyObject;
  }

  export interface ConfigResponse {
    owner: AccAddress;
    mint_contract: AccAddress;
    factory_contract: AccAddress;
    base_denom: string;
  }

  export interface CollateralPriceResponse {
    asset: AccAddress;
    rate: string;
    last_updated: number;
    collateral_premium: string;
    is_revoked: boolean;
  }

  export interface CollateralInfoResponse {
    asset: AccAddress;
    collateral_premium: string;
    source_type: string;
    is_revoked: boolean;
  }

  export interface CollateralInfosResponse {
    collaterals: Array<CollateralInfoResponse>;
  }

  export type HandleMsg =
    | HandleUpdateConfig
    | HandleRegisterCollateralAsset
    | HandleRevokeCollateralAsset
    | HandleUpdateCollateralPremium
    | HandleUpdateCollateralPriceSource;

  export type QueryMsg =
    | QueryConfig
    | QueryCollateralPrice
    | QueryCollateralAssetInfo
    | QueryCollateralAssetInfos;
}

export class MirrorCollateralOracle extends ContractClient {
  public init(
    init_msg: MirrorCollateralOracle.InitMsg,
    migratable: boolean
  ): MsgInstantiateContract {
    return this.createInstantiateMsg(init_msg, {}, migratable);
  }

  public updateConfig(
    config: MirrorCollateralOracle.HandleUpdateConfig['update_config']
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_config: config
    });
  }

  public registerCollateralAsset(
    asset: AssetInfo,
    price_source: MirrorCollateralOracle.SourceType,
    collateral_premium: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      register_collateral_asset: {
        asset,
        price_source,
        collateral_premium: new Dec(collateral_premium).toFixed()
      }
    });
  }

  public revokeCollateralAsset(asset: AssetInfo): MsgExecuteContract {
    return this.createExecuteMsg({
      revoke_collateral_asset: {
        asset
      }
    });
  }

  public updateCollateralPremium(
    asset: AssetInfo,
    collateral_premium: Numeric.Input
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_collateral_premium: {
        asset,
        collateral_premium: new Dec(collateral_premium).toFixed()
      }
    });
  }

  public updateCollateralPriceSource(
    asset: AssetInfo,
    price_source: MirrorCollateralOracle.SourceType
  ): MsgExecuteContract {
    return this.createExecuteMsg({
      update_collateral_price_source: {
        asset,
        price_source
      }
    });
  }

  public async getConfig(): Promise<MirrorCollateralOracle.ConfigResponse> {
    return this.query({
      config: {}
    });
  }

  public async getCollateralPrice(
    asset: string
  ): Promise<MirrorCollateralOracle.CollateralPriceResponse> {
    return this.query({
      collateral_price: { asset }
    });
  }

  public async getCollateralAssetInfo(
    asset: string
  ): Promise<MirrorCollateralOracle.CollateralInfoResponse> {
    return this.query({
      collateral_asset_info: { asset }
    });
  }

  public async getCollateralAssetInfos(): Promise<MirrorCollateralOracle.CollateralInfosResponse> {
    return this.query({
      collateral_asset_infos: {}
    });
  }

  // Typed overloads

  protected async query<T>(
    query_msg: MirrorCollateralOracle.QueryMsg
  ): Promise<T> {
    return super.query(query_msg);
  }

  protected createExecuteMsg(
    execute_msg: MirrorCollateralOracle.HandleMsg,
    coins: Coins.Input = {}
  ): MsgExecuteContract {
    return super.createExecuteMsg(execute_msg, coins);
  }
}
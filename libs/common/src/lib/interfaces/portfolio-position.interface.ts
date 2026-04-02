import { Market, MarketAdvanced } from '@ghostfolio/common/types';

import { AssetClass, AssetSubClass, DataSource, Tag } from '@prisma/client';

import { Country } from './country.interface';
import { EnhancedSymbolProfile } from './enhanced-symbol-profile.interface';
import { Holding } from './holding.interface';
import { Sector } from './sector.interface';

export interface PortfolioPosition {
  activitiesCount: number;
  allocationInPercentage: number;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.assetClass instead */
  assetClass?: AssetClass;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.assetClassLabel instead */
  assetClassLabel?: string;

  assetProfile: Pick<
    EnhancedSymbolProfile,
    | 'assetClass'
    | 'assetSubClass'
    | 'countries'
    | 'currency'
    | 'dataSource'
    | 'holdings'
    | 'name'
    | 'sectors'
    | 'symbol'
    | 'url'
  > & {
    assetClassLabel?: string;
    assetSubClassLabel?: string;
  };

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.assetSubClass instead */
  assetSubClass?: AssetSubClass;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.assetSubClassLabel instead */
  assetSubClassLabel?: string;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.countries instead */
  countries: Country[];

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.currency instead */
  currency: string;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.dataSource instead */
  dataSource: DataSource;

  dateOfFirstActivity: Date;
  dividend: number;
  exchange?: string;
  grossPerformance: number;
  grossPerformancePercent: number;
  grossPerformancePercentWithCurrencyEffect: number;
  grossPerformanceWithCurrencyEffect: number;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.holdings instead */
  holdings: Holding[];

  investment: number;
  marketChange?: number;
  marketChangePercent?: number;
  marketPrice: number;
  markets?: { [key in Market]: number };
  marketsAdvanced?: { [key in MarketAdvanced]: number };

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.name instead */
  name: string;

  netPerformance: number;
  netPerformancePercent: number;
  netPerformancePercentWithCurrencyEffect: number;
  netPerformanceWithCurrencyEffect: number;
  quantity: number;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.sectors instead */
  sectors: Sector[];

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.symbol instead */
  symbol: string;

  tags?: Tag[];
  type?: string;

  /** @deprecated Use {@link PortfolioPosition.assetProfile}.url instead */
  url?: string;

  valueInBaseCurrency?: number;
  valueInPercentage?: number;
}

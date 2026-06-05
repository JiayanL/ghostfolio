import { AuthGuard } from '@ghostfolio/client/core/auth.guard';
import { internalRoutes } from '@ghostfolio/common/routes/routes';

import { Routes } from '@angular/router';

import { GfTradePageComponent } from './trade-page.component';

export const routes: Routes = [
  {
    canActivate: [AuthGuard],
    children: [
      {
        loadComponent: () =>
          import('./trade-panel/trade-panel.component').then(
            (c) => c.GfTradePanelComponent
          ),
        path: '',
        title: internalRoutes.trade.subRoutes.trade.title
      },
      {
        loadComponent: () =>
          import('./trade-orders/trade-orders.component').then(
            (c) => c.GfTradeOrdersComponent
          ),
        path: internalRoutes.trade.subRoutes.orders.path,
        title: internalRoutes.trade.subRoutes.orders.title
      },
      {
        loadComponent: () =>
          import('./trade-positions/trade-positions.component').then(
            (c) => c.GfTradePositionsComponent
          ),
        path: internalRoutes.trade.subRoutes.positions.path,
        title: internalRoutes.trade.subRoutes.positions.title
      }
    ],
    component: GfTradePageComponent,
    path: '',
    title: internalRoutes.trade.title
  }
];

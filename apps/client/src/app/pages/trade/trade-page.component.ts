import { UserService } from '@ghostfolio/client/services/user/user.service';
import { TabConfiguration, User } from '@ghostfolio/common/interfaces';
import { internalRoutes } from '@ghostfolio/common/routes/routes';

import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline,
  listOutline,
  swapHorizontalOutline
} from 'ionicons/icons';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  host: { class: 'page has-tabs' },
  imports: [IonIcon, MatTabsModule, RouterModule],
  selector: 'gf-trade-page',
  styleUrls: ['./trade-page.scss'],
  templateUrl: './trade-page.html'
})
export class GfTradePageComponent implements OnInit {
  public deviceType: string;
  public tabs: TabConfiguration[] = [];
  public user: User;

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private deviceService: DeviceDetectorService,
    private userService: UserService
  ) {
    this.userService.stateChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;

          this.tabs = [
            {
              iconName: 'swap-horizontal-outline',
              label: internalRoutes.trade.subRoutes.trade.title,
              routerLink: internalRoutes.trade.routerLink
            },
            {
              iconName: 'list-outline',
              label: internalRoutes.trade.subRoutes.orders.title,
              routerLink: internalRoutes.trade.subRoutes.orders.routerLink
            },
            {
              iconName: 'briefcase-outline',
              label: internalRoutes.trade.subRoutes.positions.title,
              routerLink: internalRoutes.trade.subRoutes.positions.routerLink
            }
          ];

          this.changeDetectorRef.markForCheck();
        }
      });

    addIcons({ briefcaseOutline, listOutline, swapHorizontalOutline });
  }

  public ngOnInit() {
    this.deviceType = this.deviceService.getDeviceInfo().deviceType;
  }
}

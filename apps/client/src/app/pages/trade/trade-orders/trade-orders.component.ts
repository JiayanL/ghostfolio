import { UserService } from '@ghostfolio/client/services/user/user.service';
import { TradeOrder, User } from '@ghostfolio/common/interfaces';
import { NotificationService } from '@ghostfolio/ui/notifications';
import { DataService } from '@ghostfolio/ui/services';
import { GfValueComponent } from '@ghostfolio/ui/value';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  DestroyRef,
  OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GfValueComponent,
    MatButtonModule,
    MatTableModule,
    NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'gf-trade-orders',
  styleUrls: ['./trade-orders.scss'],
  templateUrl: './trade-orders.html'
})
export class GfTradeOrdersComponent implements OnInit {
  public displayedColumns = [
    'createdAt',
    'symbol',
    'side',
    'type',
    'quantity',
    'price',
    'status',
    'actions'
  ];
  public isLoading = true;
  public orders: TradeOrder[] = [];
  public user: User;

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    private destroyRef: DestroyRef,
    private notificationService: NotificationService,
    private userService: UserService
  ) {
    this.userService.stateChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state?.user) {
          this.user = state.user;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  public ngOnInit() {
    this.loadOrders();
  }

  public getStatusClass(status: TradeOrder['status']): string {
    switch (status) {
      case 'FILLED':
        return 'badge-success';
      case 'PENDING':
        return 'badge-warning';
      case 'CANCELLED':
        return 'badge-secondary';
      case 'PARTIAL':
        return 'badge-info';
      default:
        return '';
    }
  }

  public onCancelOrder(order: TradeOrder) {
    this.dataService
      .deleteTradeOrder(order.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.orders = this.orders.map((existingOrder) =>
            existingOrder.id === order.id
              ? { ...existingOrder, status: 'CANCELLED' as const }
              : existingOrder
          );

          this.notificationService.alert({
            message: order.symbol,
            title: 'Order cancelled'
          });

          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private loadOrders() {
    this.dataService
      .fetchTradeOrders()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ orders }) => {
          this.orders = orders;
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}

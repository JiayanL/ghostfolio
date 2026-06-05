import { UserService } from '@ghostfolio/client/services/user/user.service';
import { TradePosition, User } from '@ghostfolio/common/interfaces';
import { DataService } from '@ghostfolio/ui/services';
import { GfTrendIndicatorComponent } from '@ghostfolio/ui/trend-indicator';
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
import { MatTableModule } from '@angular/material/table';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GfTrendIndicatorComponent,
    GfValueComponent,
    MatTableModule,
    NgxSkeletonLoaderModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'gf-trade-positions',
  styleUrls: ['./trade-positions.scss'],
  templateUrl: './trade-positions.html'
})
export class GfTradePositionsComponent implements OnInit {
  public displayedColumns = [
    'symbol',
    'quantity',
    'avgCost',
    'currentPrice',
    'marketValue',
    'unrealizedPnL'
  ];
  public isLoading = true;
  public positions: TradePosition[] = [];
  public totalMarketValue = 0;
  public totalUnrealizedPnL = 0;
  public user: User;

  public constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dataService: DataService,
    private destroyRef: DestroyRef,
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
    this.loadPositions();
  }

  private loadPositions() {
    this.dataService
      .fetchTradePositions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ positions }) => {
          this.positions = positions;
          this.totalMarketValue = positions.reduce(
            (sum, position) => sum + position.marketValue,
            0
          );
          this.totalUnrealizedPnL = positions.reduce(
            (sum, position) => sum + position.unrealizedPnL,
            0
          );
          this.isLoading = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }
}

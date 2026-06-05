import { UserService } from '@ghostfolio/client/services/user/user.service';
import {
  TradeOrderSide,
  TradeOrderType,
  TradeQuote,
  User
} from '@ghostfolio/common/interfaces';
import { NotificationService } from '@ghostfolio/ui/notifications';
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
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    GfTrendIndicatorComponent,
    GfValueComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxSkeletonLoaderModule,
    ReactiveFormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'gf-trade-panel',
  styleUrls: ['./trade-panel.scss'],
  templateUrl: './trade-panel.html'
})
export class GfTradePanelComponent implements OnInit {
  public estimatedTotal = 0;
  public isLoading = true;
  public isSubmitting = false;
  public orderForm = new FormGroup({
    limitPrice: new FormControl<number | null>(null),
    orderType: new FormControl<TradeOrderType>('MARKET', {
      nonNullable: true
    }),
    quantity: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    side: new FormControl<TradeOrderSide>('BUY', { nonNullable: true })
  });
  public quotes: TradeQuote[] = [];
  public selectedQuote: TradeQuote;
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

    this.orderForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateEstimatedTotal();
      });
  }

  public ngOnInit() {
    this.loadQuotes();
  }

  public get isLimitOrder(): boolean {
    return this.orderForm.controls.orderType.value === 'LIMIT';
  }

  public get isSellOrder(): boolean {
    return this.orderForm.controls.side.value === 'SELL';
  }

  public onOrderTypeChange() {
    const limitPriceControl = this.orderForm.controls.limitPrice;

    if (this.isLimitOrder) {
      limitPriceControl.setValidators([
        Validators.required,
        Validators.min(0.01)
      ]);
      limitPriceControl.setValue(this.selectedQuote?.price ?? null);
    } else {
      limitPriceControl.clearValidators();
      limitPriceControl.setValue(null);
    }

    limitPriceControl.updateValueAndValidity();
    this.updateEstimatedTotal();
  }

  public onSelectQuote(quote: TradeQuote) {
    this.selectedQuote = quote;

    if (this.isLimitOrder) {
      this.orderForm.controls.limitPrice.setValue(quote.price);
    }

    this.updateEstimatedTotal();
    this.changeDetectorRef.markForCheck();
  }

  public onSubmitOrder() {
    if (!this.selectedQuote || this.orderForm.invalid) {
      return;
    }

    const { limitPrice, orderType, quantity, side } =
      this.orderForm.getRawValue();

    this.isSubmitting = true;
    this.changeDetectorRef.markForCheck();

    this.dataService
      .postTradeOrder({
        limitPrice:
          orderType === 'LIMIT' ? (limitPrice ?? undefined) : undefined,
        name: this.selectedQuote.name,
        quantity,
        side,
        symbol: this.selectedQuote.symbol,
        type: orderType
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.alert({
            message: `${quantity} shares of ${this.selectedQuote.symbol}`,
            title: side === 'BUY' ? 'Buy order placed' : 'Sell order placed'
          });

          this.orderForm.controls.quantity.setValue(1);
          this.isSubmitting = false;
          this.changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isSubmitting = false;
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private loadQuotes() {
    this.dataService
      .fetchTradeQuotes()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ quotes }) => {
          this.quotes = quotes;
          this.selectedQuote = quotes[0];
          this.isLoading = false;
          this.updateEstimatedTotal();
          this.changeDetectorRef.markForCheck();
        }
      });
  }

  private updateEstimatedTotal() {
    if (!this.selectedQuote) {
      this.estimatedTotal = 0;
      return;
    }

    const { limitPrice, orderType, quantity } = this.orderForm.getRawValue();
    const price =
      orderType === 'LIMIT' ? (limitPrice ?? 0) : this.selectedQuote.price;

    this.estimatedTotal = price * quantity;
  }
}

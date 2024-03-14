import { Component, ElementRef, OnDestroy, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { ColorType, ProductWidgetModel } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @ViewChildren('badge') badgeElements?: QueryList<ElementRef>;
  private subscription: Subscription = new Subscription();
  productWidgets: ProductWidgetModel[] = [];
  colorCollection: ColorType[] = ['blue', 'beige', 'white', 'green', 'black'];

  /** Configuration for tooltip elements, which helps with clearing the timeout responsible for hiding the respective tooltip */
  tooltipTimeoutConfig: { tooltip: HTMLDivElement | null, timeout: number } = {
    tooltip: null,
    timeout: 0
  };

  constructor(private productService: ProductService, private renderer: Renderer2) {
  }

  /** When the application is initialized, retrieve product widget data from API */
  ngOnInit() {
    this.getProductWidgets();
  }

  /** Retrieves product widget data from the API and assigns it to the productWidgets array */
  getProductWidgets(): void {
    this.subscription = this.productService.getProductWidgets().subscribe((productWidgets: ProductWidgetModel[]): void => {
      this.productWidgets = productWidgets || [];
      if (productWidgets && productWidgets.length) {
        /* After the DOM is rendered, selected colors from the API data will be set as background colors for the badge elements */
        this.initializeBadgeColors();

        /* Initial check to rule out multiple active badges from API, if there are any  */
        this.checkForMultipleActiveBadges();
      }
    })
  }

  /** Returns a boolean value, indicating if a color is considered bright */
  isBrightColor(color: ColorType): boolean {
    return color === 'white' || color === 'beige';
  }

  /** Initializes background and font color on badge element based on the data */
  initializeBadgeColors(): void {
    /* Tactical timeout, to make sure badge elements are rendered after widget data is retrieved */
    setTimeout(() => {
      this.badgeElements?.forEach((badge: ElementRef, index: number) => {
        const color: ColorType = this.productWidgets[index].selectedColor;
        badge.nativeElement.style.backgroundColor = `var(--${color})`;
        const fontColor: ColorType = this.isBrightColor(color) ? 'green' : 'white';
        badge.nativeElement.children[0].style = `background-color: var(--${fontColor})`;
        badge.nativeElement.children[1].style = `color: var(--${fontColor})`;
      });
    });
  }

  /** Changes background and font color of badge element */
  selectColor(widget: ProductWidgetModel, color: ColorType, badge: HTMLDivElement): void {
    widget.selectedColor = color;
    badge.style.backgroundColor = `var(--${color})`;
    const fontColor: ColorType = this.isBrightColor(color) ? 'green' : 'white';
    this.renderer.setStyle(badge.children[0], 'background-color', `var(--${fontColor})`);
    this.renderer.setStyle(badge.children[1], 'color', `var(--${fontColor})`);
  }

  /** Checks if data from API contains multiple product widgets with active badges, to make sure only one is active at a time [ first match ] */
  checkForMultipleActiveBadges(): void {
    for (let widgetIndex = 0; widgetIndex < this.productWidgets.length; widgetIndex++) {
      if (this.productWidgets[widgetIndex].active) {
        this.activateBadge(widgetIndex);
      }
    }
  }

  /** Marks a widget as active based on index */
  activateBadge(index: number): void {
    this.productWidgets.forEach((widget: ProductWidgetModel, widgetIndex: number): void => {
      widget.active = index === widgetIndex;
    });
  }

  /** Brings the tooltip element forth by setting its z-index value to 1, and re-positions the tooltip if it's out of bounds */
  onTooltipShow(tooltip: HTMLDivElement): void {
    this.renderer.setStyle(tooltip, 'z-index', 1);
    if (tooltip === this.tooltipTimeoutConfig.tooltip) {
      clearTimeout(this.tooltipTimeoutConfig.timeout);
    }

    this.tooltipTimeoutConfig.tooltip = tooltip;

    const tooltipRect = tooltip.getBoundingClientRect();
    const isOutOfBoundsOnRight: boolean = (tooltipRect.x + tooltipRect.width) > window.innerWidth;
    const isOutOfBoundsOnBottom: boolean = (tooltipRect.y + tooltipRect.height) > window.outerHeight;

    if (isOutOfBoundsOnRight && isOutOfBoundsOnBottom) {
      this.renderer.setStyle(tooltip, 'transform', 'translate(-50%, -115%)');
      return;
    }

    if (isOutOfBoundsOnRight) {
      this.renderer.setStyle(tooltip, 'transform', 'translateX(-50%)');
      return;
    }

    if (isOutOfBoundsOnBottom) {
      this.renderer.setStyle(tooltip, 'transform', 'translateY(-115%)');
      return;
    }
  }

  /** Hides the tooltip element from the cursor, by setting its z-index value to -1. Timeout is cleared in the onTooltipShow() function */
  onTooltipHide(tooltip: HTMLDivElement): void {
    this.tooltipTimeoutConfig.tooltip = tooltip;
    this.tooltipTimeoutConfig.timeout = setTimeout(() => {
      this.renderer.setStyle(tooltip, 'z-index', -1);
    }, 250)
  }

  /** Unsubscribe from the active Observable stream */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

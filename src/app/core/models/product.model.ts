export type ColorType = 'white' | 'black' | 'blue' | 'green' | 'beige';

export interface ProductWidgetModel {
  id: number;
  type: 'carbon' | 'plastic bottles' | 'trees';
  amount: number;
  action: 'collects' | 'plants' | 'offsets';
  active: boolean;
  linked: boolean;
  selectedColor: ColorType;
}

export class ProductWidget implements ProductWidgetModel {
  id: number = 0;
  type: 'carbon' | 'plastic bottles' | 'trees' = 'carbon';
  amount: number = 0;
  action: 'collects' | 'plants' | 'offsets' = 'collects';
  active: boolean = false;
  linked: boolean = false;
  selectedColor: ColorType = 'white';

  constructor(data?: Partial<ProductWidgetModel>) {
    if (!data) {
      return;
    }

    Object.assign(this, data);
  }
}

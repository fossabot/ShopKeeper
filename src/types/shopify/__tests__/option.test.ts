import {testCreateStore} from '../../../testing/data';
import {ShopifyTypes} from '../../base';
import {OptionData$Raw, OptionItem} from '../option';

describe('Option Shopify Type', () => {
  const store = testCreateStore();
  const optionData: OptionData$Raw = {
    id: 10,
    name: 'Option',
    position: 1,
    product_id: 1,
    values: ['Default'],
  };

  it('defines itemType properly', () => {
    const option = new OptionItem(store, optionData);
    expect(option.itemType).toEqual(ShopifyTypes.Option);
  });

  it('is instantiable', () => {
    const option = new OptionItem(store, optionData);

    expect(option).toBeDefined();
    expect(option).toBeInstanceOf(OptionItem);
  });

  it('stores rawData to data properly', () => {
    const option = new OptionItem(store, optionData);

    expect(option.data).toEqual(optionData);
    expect(option.toShopifyJSON()).toEqual(optionData);
  });
});

import {shopify_printf} from '../routing';


describe('Routing Utilities', () => {
  describe('shopify_printf', () => {
    it('should replace strings properly', () => {
      const ctx = {prefix: 'products', gg: 'bro'};
      const dest = shopify_printf('/admin/{prefix}/{nowork}.json', ctx);

      expect(dest).toEqual('/admin/products/{nowork}.json');
    });
  });
});
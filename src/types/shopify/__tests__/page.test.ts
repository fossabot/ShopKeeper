import {testCreateStore} from '../../../testing/data';
import {Handle, ShopifyTypes} from '../../base';
import {PageData, PageData$Raw, PageItem} from '../page';


describe('Page Shopify Type', () => {
  const store = testCreateStore();
  const pageDefaultDate = '2000-01-01T00:00:00.000Z';
  const pageData: PageData$Raw<Handle> = {
    id: 1,
    title: 'Title',
    handle: 'handle',
    body_html: '<body></body>',
    template_suffix: 'suffix',

    created_at: pageDefaultDate,
    updated_at: pageDefaultDate,
    published_at: pageDefaultDate,
  };

  it('is defined properly', () => {
    const page = new PageItem(store, pageData);
    expect(page.itemType).toEqual(ShopifyTypes.Page);
  });

  it('is instantiable', () => {
    const page = new PageItem(store, pageData);

    expect(page).toBeDefined();
    expect(page.data).toBeDefined();
    expect(page).toBeInstanceOf(PageItem);
    expect(page.toShopifyJSON()).toEqual(pageData);
    expect(page.data).toEqual({
      id: pageData.id,
      title: pageData.title,
      handle: pageData.handle,
      html: pageData.body_html,
      template: null,
      templateSuffix: pageData.template_suffix,
      createdAt: new Date(pageDefaultDate),
      updatedAt: new Date(pageDefaultDate),
      publishedAt: new Date(pageDefaultDate),
    } as PageData<Handle>);
  });
});

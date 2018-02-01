[![Build Status](https://travis-ci.org/Sleep-EZ/ShopKeeper.svg?branch=master)](https://travis-ci.org/Sleep-EZ/ShopKeeper)[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSleep-EZ%2FShopKeeper.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FSleep-EZ%2FShopKeeper?ref=badge_shield)

[![npm version](https://badge.fury.io/js/shopkeeper.svg)](https://www.npmjs.com/package/shopkeeper)
[![Downloads](https://img.shields.io/npm/dm/shopkeeper.svg)](https://www.npmjs.com/package/shopkeeper)
[![codecov](https://codecov.io/gh/Sleep-EZ/ShopKeeper/branch/master/graph/badge.svg)](https://codecov.io/gh/Sleep-EZ/ShopKeeper)
[![DeepScan Grade](https://deepscan.io/api/projects/1775/branches/7608/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1775&bid=7608)

# ShopKeeper 

[ShopKeeper](#) is a robust TypeScript framework for Shopify stores. Define your data in JS/TypeScript and let ShopKeeper control your Shopify site. Operating as a Desired State Configurator (DSC), we ensure that every small detail of your Shopify site is accurate and up-to-date. A quick overview of features and the possible use patterns:


This project was created to manage the Shopify store for [Sleep EZ](https://www.sleepez.com/?utm_campaign=GitHub-ShopKeeper&utm_medium=referral&utm_source=github.com) (we sell really comfy mattresses made for you). We realized the value of this software is too great to keep private and so we've made an effort to open-source ShopKepeer. Internally, this is the 3rd recreation of ShopKeeper due to the previous versions' being plagued with constant issues and numerous bugs. Without TypeScript, I don't believe writing this software would have been possible.

## Installation

ShopKeeper itself is a framework, and it's recommended that when getting started or migrating to ShopKeeper that you create a new workspace by cloning our [ShopKeeper-Example-Repo](#) (currently unavailable, WIP...). 

If you'd like to install our package the latest stable version is available:
```
npm install shopkeeper
```

## Documentation

* [Coming Soon....](#)


## Features

* **Unit Test Your Entire Store** (even from outside your codebase!)
* Describe Shopify types in pure JavaScript / TypeScript
* Sync products from your custom-designed database directly to Shopify
* Manage product images and other assets easily and store in VCS
* Easy deployment and management of Shopify themes
* A templating engine for dynamic generation of product and page content
* When used with VCS, provides a historical state of your Shopify store
* Easily deploy or publish to one or many stores (for users with many intl. domains)
* Gives developers the power to do anything they want
* Almost everything about a Shopify store can be managed now

With **ShopKeeper**, we intended on giving developers the most leverage to do what they do best: coding. Write **Products**, **Pages**, **Redirects**. Even more detailed types like **Fulfillment Managers**, **Price Rules**, are defined with simple JS objects. The best way to show the ease of ShopKeeper is an example:

## Example Use Case
For example, **ACME Toys** has an incredibly large product catalog, with tens of thousands of variants and want to move from their custom e-commerce platform, to a new Shopify store. How will they transfer their product catalog? By creating some abhorrent giant CSV to import to Shopify (where weird things can happen and pricing errors can go unnoticed?

But that's only *Products*... what about Pages? ...Collections? ...Redirects? ...Blog Posts? Ensuring the store is configured correctly? The list goes on.

With ShopKepeer, **ACME Toys** could use their existing database (software is irrelevant) for their e-commerce site and convert their existing products to items that can be uploaded directly to Shopify. This provides many benefits for **ACME**, including the ability for their employees to continue using their old e-commerce interface to modify, add, and removing products in a way that their employees are already accustomed to. It also **reduces migration mistakes**, **gives developers more power** by being able to implement their products in NodeJS, and also **allows for unit testing** products, or any other Shopify type. 

## Example Redirect
The following example shows a definition of a **Redirect**, one of the simplest types that can be created. (It's usually easier to read a CSV and iterate through them instead of defining each one in a file, but of course, it's up to you.

```typescript
import {Redirect} from 'shopkeeper/lib/client';

export new Redirect({
    path: '/old/url',
    target: '/pages/new-page',
});
```

## Example Product

The following code is an example of defining a new **Product** in a Shopify store. The **Product** is one of the most complicated types due to the `options` and `variants` that are required. Using JavaScript can help us leverage the generation of these **Variants** (and also appropriate testing for such) and adds utility for the easy addition/removal of product options. 

```typescript
import {Product, makeOptions, makeVariants} from 'shopkeeper/lib/client';

// This code is for example, you can lookup pricing however you'd like.
const prices = {"Green": { "Small": 15.99, ... }};
const markup = 1.25; // For example - a simple 25% markup

// makeOptions() generates a special object to be added to the Product.
// In this example, 4*3 leads to 12 Product variants.
const options = makeOptions(
    { name: "Color", values: ["Green", "Blue", "Orange", "Yellow"] },
    { name: "Size", values: ["Small", "Medium", "Large"] }
);

const variants = makeVariants(options, (variantOptions: string[]) => {
    const [color, size] = variantOptions;
    const price = prices[color][size];
    
    return {
        price: prices[color][size],
        comparePrice: prices[color][size] * markup,
        // Create your own functions to generate SKUs in your own format!
        //sku: skuify(color, size),
    };
});

// Finally, create the product.
const ToyBall = new Product({
    title: 'Toy Ball',
    handle: 'toy-ball',
    vendor: 'ACME Toys',
    productType: 'Young Child',
    ...options,
    ...variants,
});

// We export the instance to be collected in the module root into an Array
exports = ToyBall;
```

## TODO

ShopKeeper is pre-release software so it's API and featureset are eligible to change. The following is a list of features that are being worked on or still need to be implemented:

- [ ] Basic Shopify Types
    - [x] Country
    - [x] Province
    - [x] Shop
    - [x] Page
    - [x] Product
    - [x] ProductVariant
    - [ ] ProductImage
    - [ ] Redirect
    - [ ] ScriptTag
    - [ ] CarrierService
    - [ ] Theme
    - [ ] Asset
    - [ ] User
    - [ ] Webhook
    - [ ] Article
    - [ ] Blog
- [ ] Collections
    - [ ] SmartCollection
    - [ ] CustomCollection
- [ ] Metafields
- [ ] Product Images
    - [ ] ProductImage type
    - [ ] Reading locally
    - [ ] Syncronization
- [ ]  Price Rules, Coupons, and Gift Cards
    - [ ] PriceRule
    - [ ] DiscountCode
    - [ ] GiftCard

(pretty big TODO list, right?)


### License

[ShopKeeper](#) is licensed under the [GNU AGPL 3.0](LICENSE.txt) license. Please feel free to contribute, fork, and expand on this project!

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FSleep-EZ%2FShopKeeper.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FSleep-EZ%2FShopKeeper?ref=badge_large)
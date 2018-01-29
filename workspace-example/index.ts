import {Product, makeOptions, makeVariants} from '../src/lib/client';

const options = makeOptions(
    {name: 'Size', values: ['Twin', 'Full', 'Queen']},
    {name: 'Firmness', values: ['Soft', 'Med.', 'Firm']});

const variants = makeVariants(options, (variantOptions: string[]) => {
    const [size, firmness] = variantOptions;

    return {
        price: 0,
        comparePrice: 0,
        sku: `${size}-${firmness}`,
    };
});

const Roma = new Product({
    title: 'Roma Latex Mattress',
    handle: 'roma-latex-mattress',

    ...options,
    ...variants,
});
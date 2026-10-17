JAINEX KITCHENWARE — UPDATED WEBSITE PACKAGE

What changed:
- Homepage includes clickable product categories.
- Selecting a category opens category.html and shows products in that category.
- Selecting a product opens product.html with image, description, price and GST.
- Add to Cart changes to minus / quantity / plus on the same product card.
- Cart quantity is saved in the browser so it remains after moving between pages.
- cart.html shows each item amount, subtotal, GST and total, then sends order details to WhatsApp.
- Pages CMS configuration includes a GST field for future products.

IMPORTANT:
- Existing product records in data/products.json are retained.
- First existing product has GST set to 5% based on the details supplied. Other products are set to 0% until you enter their correct GST rates in Pages CMS.
- The cart is browser-based, not a server-side order database. Orders are only sent when the customer taps the WhatsApp order button and sends the message.
- WhatsApp number in script.js: 916375571735.
- Main stylesheet is style.css. Logo file is jainex-logo.png.
- Netlify should deploy from GitHub main as before.

HOW TO UPDATE GITHUB:
1. Download and extract this ZIP on a computer if possible.
2. In your existing GitHub repository, replace index.html, script.js, style.css, .pages.yml and data/products.json with the versions in this package.
3. Add the new category.html, product.html and cart.html files to the repository root.
4. Do not delete assets/ or your existing product images.
5. Commit changes. Netlify should deploy automatically.
6. Test the homepage, click a category, open a product, add quantity, open Cart and check totals.
\n\nLATEST UPDATE (October 2026)\n- Homepage now includes a 4-slide rotating banner. Edit slide1Image through slide4Image, titles and text in Pages CMS > Website settings. Upload banner images using the brand_assets media folder.\n- Website calculations apply a fixed GST rate of 5% to every product automatically. Catalogue GST values have been normalized to 5%.\n- Category cards lead to category.html; product cards lead to product.html; cart uses browser localStorage and checkout is on cart.html.\n
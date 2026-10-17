JAINEX KITCHENWARE — CATALOGUE CATEGORY UPDATE

WHAT CHANGED
- Removed the Categories link from the top navigation; the homepage still has the Shop by Category section.
- Changed category cards to round/circular product images inspired by your reference image.
- Fixed slider background image paths by encoding spaces in filenames.
- Changed local asset paths to relative paths so images work in VS Code Live Server inside the project folder and on the live site.
- Category click opens category.html?category=...; product click opens product.html?id=...; existing cart and 5% GST logic retained.

IMPORTANT
Your current data/products.json contains only 3 products, all in the Storage category. Therefore the site can only display the category/categories represented by those current products. Add the other product ranges in data/products.json / Pages CMS and assign the correct category to each product to populate Kitchen Sink, Chopping Board, Plate Rack, Dish Drainer, Fruit & Vegetable Rack, Oven Stand, etc. This update does not invent or add products.

LOCAL TEST
1. Extract this ZIP.
2. Open the inner jainex-kitchenware-site-main folder in VS Code.
3. Open index.html with Live Server (do not open it as a file:// URL).
4. Check slider images, circular category tile, click category, click product, and add-to-cart.
5. Do not upload to GitHub until local test looks correct.

JAINEX KITCHENWARE — LOCAL TEST + ADMIN EDITOR (HINDI)

इस ZIP में क्या है:
1. Home page पर गोल फोटो वाली categories; एक पेज पर 6 tiles और arrows से अगली category page.
2. Category पर click करने से उसी category के products खुलते हैं. अभी असली catalogue में 3 products हैं: 2 Matka Stand और 1 Wall Hook Rack. बाकी category में products add करने होंगे.
3. Wholesale link/section हटाया गया है.
4. Add to Cart और +/- quantity, GST 5% और cart रखा गया है.
5. admin.html local editor है: product names/prices/categories/images, WhatsApp number, logo path, banner paths/text, site copy और colors बदल सकते हैं.

LOCAL TEST:
- ZIP Extract All करें.
- VS Code > File > Open Folder > jainex-kitchenware-site-main चुनें.
- index.html पर right-click > Open with Live Server.
- Admin editor के लिए उसी Live Server में /admin.html खोलें.

IMPORTANT ABOUT ADMIN:
admin.html browser localStorage में changes रखता है, इसलिए उसी computer/browser में preview होता है; यह secure server admin नहीं है और सीधे public Netlify site को update नहीं करता. Public update के लिए Admin में Export site.json और Export products.json दबाएँ, डाउनलोड की गई files को project के data folder में replace करें, फिर test करके GitHub पर upload/commit करें. Live secure content editing के लिए Pages CMS (GitHub sign-in) भी configured है via .pages.yml.

IMAGE PATHS:
Banner/category/product images को project के assets folder में रखें और admin में relative path दें, जैसे assets/categories/matka-stand.jpg या assets/banners/slider-kitchen-organization.jpg.

JAINEX KITCHENWARE — LOCAL TEST ZIP (NEW PRODUCT PHOTOS + ADMIN EDITOR)

इस ZIP में आपके भेजे हुए 10 catalogue product photos को products में जोड़ा गया है। शुरुआती कीमतें केवल अनुमान हैं और Admin Panel से बदली जा सकती हैं। खरीद/लाइव वेबसाइट से पहले हर नाम, कीमत, साइज और कैटेगरी सही कर लें। GST 5% रखा गया है।

पहले केवल लोकल टेस्ट करें; लाइव वेबसाइट पर अभी अपलोड न करें।

1. ZIP पर Right-click > Extract All करें।
2. VS Code में Extract हुए अंदर वाले jainex-kitchenware-site-main फोल्डर को Open Folder करें।
3. ऊपर Restricted Mode आए तो केवल अपनी डाउनलोड की हुई ZIP के लिए Trust Folder & Continue दबाएँ।
4. Extensions में Live Server > Enable (Workspace) दबाएँ।
5. Explorer में index.html पर Right-click > Open with Live Server करें।
6. वेबसाइट में Products पर क्लिक करें। हर पेज पर 6 प्रोडक्ट और आगे/पीछे के तीर दिखेंगे। Add to Cart और +/− चेक करें।
7. Admin Panel खोलने के लिए ब्राउज़र में उसी local server address के आगे admin.html लिखें, उदाहरण: http://127.0.0.1:5500/jainex-kitchenware-site-main/admin.html (आपके port/path के अनुसार बदल सकता है)।

Admin में product name, category, price, image path, description और visibility edit कर सकते हैं। नई फोटो बदलने के लिए फोटो assets/products/ या assets/products/catalogue-photos/ में रखें और Admin में उसका path डालें। Save local changes केवल उसी browser में preview के लिए है; live website पर बदलाव करने हेतु Export Products/Export site.json से JSON डाउनलोड करके project के data folder में सही JSON फाइल replace करें, फिर GitHub/Netlify पर update करें। यह static website वाला local editor है, secure online database/login वाला production CMS नहीं है।

Four hero banners पहले से शामिल हैं। गोल category design को जानबूझकर नहीं बदला गया है।

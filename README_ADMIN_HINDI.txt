JAINEX KITCHENWARE — CONTENT ADMIN SETUP (HINDI)

यह पैकेज वेबसाइट में Pages CMS के जरिए प्रोडक्ट और वेबसाइट टेक्स्ट बदलने के लिए तैयार किया गया है। यह अभी full ecommerce नहीं है। Cart, customer login, orders database, payment और automatic WhatsApp/email notifications अलग से जोड़ने होंगे।

पहले जरूरी काम:
1. GitHub.com पर अपना अकाउंट बनाएं/लॉगिन करें।
2. GitHub पर New repository बनाएं। नाम रखें: jainex-kitchenware-site
3. इस ZIP को Extract करें। सभी फाइलें और folders (index.html, style.css, script.js, assets, data, .pages.yml) repository में upload करें। .pages.yml भी जरूर upload करें।
4. GitHub repository में Commit changes करें।
5. Netlify dashboard में अपनी Jainex site खोलें। Project configuration > Build & deploy > Continuous deployment > Link repository में GitHub repository जोड़ें। Netlify के authorization prompts follow करें। Existing site को हटाएँ नहीं।
6. जब repository connect हो जाए, GitHub में हर update के बाद Netlify site अपने-आप deploy होगी।
7. https://app.pagescms.org खोलें और Sign in with GitHub करें। GitHub App को अपनी jainex-kitchenware-site repository तक access दें।
8. Repository खोलें। यदि .pages.yml पहले से upload है, तो Products और Website settings edit करने के options दिखने चाहिए।
9. Products में नाम, price, description, category और photo बदलें। Website settings में About Us, homepage text और hex background colors बदलें। Save/commit करें। Netlify नई साइट deploy करेगा।

Photo tip:
- Product photo चुनने/अपलोड करने पर photo assets/products में रखी जाएगी।
- Existing logo assets/jainex-logo.png को न बदलें, जब तक आप जानबूझकर नया logo upload नहीं करना चाहते।

Important:
- अभी products.json में 4 SAMPLE products/prices हैं। असली प्रोडक्ट और सही कीमतें डालने के बाद ही उन्हें ग्राहकों के लिए भरोसेमंद मानें।
- WhatsApp enquiry number configured: 919983366368.
- Pages CMS सिर्फ static site की content editing करता है। यह अपने-आप customer login, Add to Cart checkout, stock management, online payments या automatic WhatsApp/email order notifications नहीं बनाता। इन सुविधाओं के लिए database/auth/payment/notification backend अलग से चाहिए।

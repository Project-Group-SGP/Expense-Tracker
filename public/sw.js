if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const u=e=>a(e,i),r={module:{uri:i},exports:c,require:u};s[i]=Promise.all(n.map((e=>r[e]||u(e)))).then((e=>(t(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/SpendWIse-5.png",revision:"5558ebd600f066cb063222636db32fce"},{url:"/SpendWise-Badge.png",revision:"7c990b815781355e6f36dab3805fc26a"},{url:"/SpendWise-Icon.png",revision:"5d5c645ce89d4641857a07908a62fca7"},{url:"/_next/app-build-manifest.json",revision:"ae6a7a4c6a4b7d37ea14a7ea68878ec8"},{url:"/_next/static/chunks/0e5ce63c-8865bf3d16067603.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/1025-b840042c1c293ea0.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/1125-7af4636c10aec399.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/1622-49cf1db030310b6c.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/2183-596461ab2d31883b.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/231-f5e06743eb6882d9.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/2871-cb7875d987c684f9.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3277-a52528d794a67306.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3409-cef160d617b3b1e8.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3541-e7916a30f19c449e.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3791-2105c2f108e1095a.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3819-e6c91562f7a07124.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3883-5e145b2dcccc2d6b.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/3944-38029a4d040f8d35.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/4670-7bf138827e1b650a.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/641-3b837082bb3a6652.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/6458-5e4f5f256a7f99ee.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/6855-34aaa510c6a5b32f.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7023-b8ac11e0999f8461.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7090-462a0281c7b2e2a8.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7119-501a52ca71bec485.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7776-a18b2f49d8605c3f.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7824-a8a74dd54917345d.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7911-9566d4a3af98a3e9.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/7954-34a1a4c6e20c77b1.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8021-773db8b9ed119a7a.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8173-1d9ae7b313dc7dbc.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8625-e1762f0f63f4b5b6.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8730-16deb150aaa277ce.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8938-d20d1ff028459791.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/8e1d74a4-bcf88bcf8a2baca6.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/9109-378ea6cd6027e57b.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/9418-88f21d0e8da1d7ce.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/9822-112d9644c2735043.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/9c4e2130-deeb66447504dff1.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/a97e0b03-eca8b5f9e7ac9ad1.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/aaea2bcf-08ef882773a45efa.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/budget/%5Bcategory%5D/page-2359fb6b1c4c193d.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/budget/page-620ab81534af6b78.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-6e4616112409a637.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/page-ce982f9025b48f70.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/requests/page-a7cb56eedf1e2b43.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/group/page-71d2238fb45817bf.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/history/loading-13a3359e90359329.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/history/page-39e4c7505940d899.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/layout-8bdcbb584add6e6f.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/report/page-efd56436367618f7.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/settings/layout-66ab621008210f8f.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/settings/loading-d65497a4cb3c6038.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/settings/page-316f9cd816513869.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/spend/page-6f9628b482eebab1.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/(dashboard)/transaction/page-6400b12b63b136db.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/404/page-53c2abb17b2756ad.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/_not-found/page-f723d803607ff887.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/error/page-e190264fe2ebdcd7.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/new-password/page-db1b039cd4eee8a5.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/new-verification/page-ff7798a04353da50.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/reset/page-e07c7b2aeabc6809.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/signin/loading-7f57e7db289d10d9.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/signin/page-ec1e24cb2064d32a.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/auth/signup/page-10e61adb21920c6c.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/error-56c7b97170dcced4.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/layout-90a139f13be15817.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/loading-9b1356c65905305d.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/app/page-747b394a50757298.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/e34aaff9-7e518c4d62e63c9f.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/fc2f6fa8-37dd54aa83623506.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/fd9d1056-b360a9affe287c61.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/main-app-ae70491ee101323e.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/main-d9ad90fdd5cda22d.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-77c50136e2160cf2.js",revision:"kXlCXsmbuHeah5f1dWMj1"},{url:"/_next/static/css/8f34ca7803a5dd98.css",revision:"8f34ca7803a5dd98"},{url:"/_next/static/css/b26f3cb99e3cf977.css",revision:"b26f3cb99e3cf977"},{url:"/_next/static/kXlCXsmbuHeah5f1dWMj1/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/kXlCXsmbuHeah5f1dWMj1/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/0484562807a97172-s.p.woff2",revision:"b550bca8934bd86812d1f5e28c9cc1de"},{url:"/_next/static/media/0a03a6d30c07af2e-s.woff2",revision:"79da53ebaf3308c806394df4882b343d"},{url:"/_next/static/media/46c21389e888bf13-s.woff2",revision:"272930c09ba14c81bb294be1fe18b049"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/icon512_maskable.png",revision:"e1bc4fe4aa3f21fa2bbcd350b24c16c9"},{url:"/icon512_rounded.png",revision:"85a2f5c8d5265fe33259b0350219cbf2"},{url:"/main_page.png",revision:"85cdd99944d92071061b2b86cf8d3bf4"},{url:"/manifest.json",revision:"eb0f5b037416f1fe8fe71d8083775ab1"},{url:"/og_image.png",revision:"50de4ccf6d11b171dac3a3f00ce24a22"},{url:"/serviceWorker.js",revision:"ffb325d4123247c7adb96cf530403a69"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

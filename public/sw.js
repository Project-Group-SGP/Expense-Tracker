if(!self.define){let a,i={};const e=(e,s)=>(e=new URL(e+".js",s).href,i[e]||new Promise((i=>{if("document"in self){const a=document.createElement("script");a.src=e,a.onload=i,document.head.appendChild(a)}else a=e,importScripts(e),i()})).then((()=>{let a=i[e];if(!a)throw new Error(`Module ${e} didn’t register its module`);return a})));self.define=(s,n)=>{const t=a||("document"in self?document.currentScript.src:"")||location.href;if(i[t])return;let c={};const r=a=>e(a,t),d={module:{uri:t},exports:c,require:r};i[t]=Promise.all(s.map((a=>d[a]||r(a)))).then((a=>(n(...a),c)))}}define(["./workbox-4754cb34"],(function(a){"use strict";importScripts(),self.skipWaiting(),a.clientsClaim(),a.precacheAndRoute([{url:"/SpendWIse-5.png",revision:"3640ea2bc985b534e9268c567075529f"},{url:"/SpendWise-Badge.png",revision:"7c990b815781355e6f36dab3805fc26a"},{url:"/SpendWise-Icon.png",revision:"5d5c645ce89d4641857a07908a62fca7"},{url:"/_next/app-build-manifest.json",revision:"7a012f0ae8bf5a36202f776821bc30b6"},{url:"/_next/static/chunks/0e5ce63c-d66fd82e77736096.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1125-e98f19373692d329.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1265-7fc83f640d8bf620.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1311-28418a79f95ee06f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/133-2adccb1aba9051f4.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1621-ce06b32d9f1c31fd.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1622-c7ca1b6f24ea16d6.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/1689-ca4b7cd3a29fe5ea.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2005-e4c4fec326d001ba.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2117-8517d4db949abfb4.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2183-51ddfa5e96717af7.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/231-ae586684c264f843.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2378-0ad24cc84fbb919d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2514-1273111de066e395.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2820-0959ea6c46fa6c5e.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/2915-0a0d1ba532c572c8.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/3198-4c37f91aa8c46860.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/3277-2f6b038cfb78afe3.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/3409-06c4a6b927a11746.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/373-356814d324003827.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/4061-621ec924da6f1fd3.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/473-1a158ed0f934e20c.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/4777-5065ce8659814589.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/508-5c1d55f649a2aa7f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/5532-02455f39f7cdeaf4.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/5800-e7a879aaed2aa1bd.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/6685-b12bcc531d9e6d4d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/6909-dca771c1a8e73723.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7023-e9f90797917ee9d3.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7090-be60e496c9547238.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7549-8db006376e916c65.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7776-9367f4b5e7f222e6.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7867-9bcdf39c5715e474.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/7906-036e4c07ca9c19f7.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/8021-4da047389dd597f5.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/8173-4acb710441ad2541.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/8512-a2eb9e848f4a43ef.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/8781-d25db3dbf723cd64.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/8e1d74a4-1dfe86e3c6b79674.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/9418-4e6c57c2eb64b607.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/a97e0b03-eca8b5f9e7ac9ad1.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/aaea2bcf-08ef882773a45efa.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/budget/%5Bcategory%5D/page-127c5d876ec41c8d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/budget/loading-8fc209f70185cc70.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/budget/page-0ce083dbbaa281d6.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/loading-95ca82bf5a02cce1.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-1991b09d311dff5f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/loading-28b72c1626366e77.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/page-bf475d21bcb8bb91.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/requests/loading-1c75b68740c6a72b.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/requests/page-07f835a71f587d9b.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/loading-39418f988bb1173d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/group/page-5248e60f99322f18.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/history/loading-85fe80d4c39df323.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/history/page-0822d02683a72310.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/layout-a1ae721b6616e1f4.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/loading-348e9e542af36869.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/recurring/page-e8dcc8bcdd37081d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/report/page-bb749592f3eb3c45.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/settings/layout-e41b97c1a1a798cc.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/settings/loading-f56da4f715b8bbaf.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/settings/page-223769d7541e1af1.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/(dashboard)/transaction/page-b804f3ef49571c4d.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/404/page-12cd06219ea9e4da.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/_not-found/page-76720e43a044ada0.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/error/page-c1721b6ab10fad79.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/new-password/page-59e7faca63ba999f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/new-verification/page-a317a921e6a01123.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/reset/page-cecb09c9b7e11024.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/signin/loading-1d40502afefe1cf6.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/signin/page-d18f361059585f9e.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/signup/loading-c90075f378a133b6.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/auth/signup/page-3007bbb59edd5146.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/error-738a537208e4a92f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/global-error-9ad575f36f798797.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/layout-113208c911d5575f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/loading-918620726a4092ef.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/app/page-985651a148f4cb24.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/e34aaff9-7e518c4d62e63c9f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/ee560e2c-cf606e912bad6ecc.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/f8025e75-dc146208b2b85c6e.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/fc2f6fa8-37dd54aa83623506.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/fd9d1056-ea018d76b18f8648.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/main-6be7c72843c51427.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/main-app-0a053f7ae57c6c1f.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-7b098435d4929af7.js",revision:"q01Z2Na9piVdU6biINNaL"},{url:"/_next/static/css/167ef756a909ffd2.css",revision:"167ef756a909ffd2"},{url:"/_next/static/css/4836d9950f954ae0.css",revision:"4836d9950f954ae0"},{url:"/_next/static/css/e8fbdc2c4760a743.css",revision:"e8fbdc2c4760a743"},{url:"/_next/static/media/0484562807a97172-s.p.woff2",revision:"b550bca8934bd86812d1f5e28c9cc1de"},{url:"/_next/static/media/c3bc380753a8436c-s.woff2",revision:"5a1b7c983a9dc0a87a2ff138e07ae822"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/_next/static/media/fe0777f1195381cb-s.woff2",revision:"f2a04185547c36abfa589651236a9849"},{url:"/_next/static/q01Z2Na9piVdU6biINNaL/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/q01Z2Na9piVdU6biINNaL/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/google2682f345c83b7839.html",revision:"1396b19da1e56579b7d899d154b31244"},{url:"/icon512_maskable.png",revision:"e1bc4fe4aa3f21fa2bbcd350b24c16c9"},{url:"/icon512_rounded.png",revision:"85a2f5c8d5265fe33259b0350219cbf2"},{url:"/main_page.png",revision:"85cdd99944d92071061b2b86cf8d3bf4"},{url:"/manifest.json",revision:"8cda205ef03b1593e2c1f59fbee6f9d1"},{url:"/og_image.png",revision:"50de4ccf6d11b171dac3a3f00ce24a22"},{url:"/robots.txt",revision:"d260a412baf7e39121ef768276fe810f"},{url:"/serviceWorker.js",revision:"ffb325d4123247c7adb96cf530403a69"},{url:"/yandex_7f79282e5b5b0673.html",revision:"356f4a088ada98ebeac097ce241720e0"}],{ignoreURLParametersMatching:[]}),a.cleanupOutdatedCaches(),a.registerRoute("/",new a.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:a,response:i,event:e,state:s})=>i&&"opaqueredirect"===i.type?new Response(i.body,{status:200,statusText:"OK",headers:i.headers}):i}]}),"GET"),a.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new a.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new a.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),a.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new a.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new a.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),a.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new a.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new a.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),a.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new a.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new a.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\/_next\/image\?url=.+$/i,new a.StaleWhileRevalidate({cacheName:"next-image",plugins:[new a.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\.(?:mp3|wav|ogg)$/i,new a.CacheFirst({cacheName:"static-audio-assets",plugins:[new a.RangeRequestsPlugin,new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\.(?:mp4)$/i,new a.CacheFirst({cacheName:"static-video-assets",plugins:[new a.RangeRequestsPlugin,new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\.(?:js)$/i,new a.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\.(?:css|less)$/i,new a.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new a.StaleWhileRevalidate({cacheName:"next-data",plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute(/\.(?:json|xml|csv)$/i,new a.NetworkFirst({cacheName:"static-data-assets",plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute((({url:a})=>{if(!(self.origin===a.origin))return!1;const i=a.pathname;return!i.startsWith("/api/auth/")&&!!i.startsWith("/api/")}),new a.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new a.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),a.registerRoute((({url:a})=>{if(!(self.origin===a.origin))return!1;return!a.pathname.startsWith("/api/")}),new a.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),a.registerRoute((({url:a})=>!(self.origin===a.origin)),new a.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new a.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

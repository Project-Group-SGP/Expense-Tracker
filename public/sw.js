if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,n)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>a(e,i),b={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>b[e]||r(e)))).then((e=>(n(...e),t)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/SpendWIse-5.png",revision:"3640ea2bc985b534e9268c567075529f"},{url:"/SpendWise-Badge.png",revision:"7c990b815781355e6f36dab3805fc26a"},{url:"/SpendWise-Icon.png",revision:"5d5c645ce89d4641857a07908a62fca7"},{url:"/_next/app-build-manifest.json",revision:"448919b4a93c24acf2f935cd250fb6a7"},{url:"/_next/static/_cwShw40bUbOFmeaHw2Il/_buildManifest.js",revision:"3e2d62a10f4d6bf0b92e14aecf7836f4"},{url:"/_next/static/_cwShw40bUbOFmeaHw2Il/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-d66fd82e77736096.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/1125-e98f19373692d329.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/133-2fb1eda32c140cb3.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/1621-ce06b32d9f1c31fd.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/1622-c7ca1b6f24ea16d6.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/1642-de05c8c2bbf89202.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/1774-14705302c65fd3c4.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/2124-fbfd25f613ab46a6.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/2183-51ddfa5e96717af7.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/23-bea936bc04368071.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/231-ae586684c264f843.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/2514-1273111de066e395.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/2915-0a0d1ba532c572c8.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/3168-b447b75d434fd71c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/3277-2f6b038cfb78afe3.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/3357-b381284bcc787d30.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/3409-06c4a6b927a11746.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/373-356814d324003827.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/473-1a158ed0f934e20c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/4777-5065ce8659814589.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/4832-00f480c73bfa1283.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/508-882a5ad21677e6dc.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/5800-e7a879aaed2aa1bd.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/5827-4f18504f49cdd699.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/6481-c83f3292ef2abbfb.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7023-e9f90797917ee9d3.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7035-1e2f4e8c7877293c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7090-be60e496c9547238.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7364-b2781fc216ac80a5.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7549-8db006376e916c65.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/7776-9367f4b5e7f222e6.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8021-4da047389dd597f5.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8173-4acb710441ad2541.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8512-a2eb9e848f4a43ef.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8599-30dbe29440f2a221.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8606-8691d0cad73038a0.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8812-4f44ce37ee76dd43.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/8e1d74a4-1dfe86e3c6b79674.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/9109-378ea6cd6027e57b.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/9167-0a06c7e16e317edf.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/9418-4e6c57c2eb64b607.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/9949-177aa779004bfc1a.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/a97e0b03-eca8b5f9e7ac9ad1.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/aaea2bcf-08ef882773a45efa.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/budget/%5Bcategory%5D/page-050e3f7306f647e7.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/budget/loading-f6aedf4f0dedc970.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/budget/page-8469aea2335d1db5.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/loading-69324ef60b7adf77.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-927cd56f19aaeccd.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/loading-dc5d8684c32678e0.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/page-e56534cc4ebcb24d.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/requests/loading-af737096270cb9b1.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/%5BgroupID%5D/requests/page-07f835a71f587d9b.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/loading-7443523b8efcd791.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/group/page-534e0db85b9a479e.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/history/loading-cfa548f0ba29c8ae.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/history/page-13d23efe3b829fe4.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/layout-f2ea389f11acfd4a.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/loading-9e64c6769cab896d.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/recurring/page-12761810c16a5671.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/report/page-bb749592f3eb3c45.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/settings/layout-e41b97c1a1a798cc.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/settings/loading-f56da4f715b8bbaf.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/settings/page-223769d7541e1af1.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/(dashboard)/transaction/page-dc0893403df3aa4c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/404/page-12cd06219ea9e4da.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/_not-found/page-76720e43a044ada0.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/error/page-c1721b6ab10fad79.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/new-password/page-9c5c0e7591c5902c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/new-verification/page-db0cb667dbae4d0c.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/reset/page-f03ae9ff54c6a5f2.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/signin/loading-7226c3f5ac6aacf3.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/signin/page-d18f361059585f9e.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/signup/loading-5b2939e8e09bd12f.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/auth/signup/page-3007bbb59edd5146.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/error-738a537208e4a92f.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/global-error-9ad575f36f798797.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/layout-113208c911d5575f.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/loading-fba5a61401cf4f3e.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/app/page-985651a148f4cb24.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/e34aaff9-7e518c4d62e63c9f.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/ee560e2c-cf606e912bad6ecc.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/f8025e75-dc146208b2b85c6e.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/fc2f6fa8-37dd54aa83623506.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/fd9d1056-ea018d76b18f8648.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/framework-8e0e0f4a6b83a956.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/main-app-0a053f7ae57c6c1f.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/main-e6f44a8bf8d43be1.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/pages/_app-f870474a17b7f2fd.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/pages/_error-c66a4e8afc46f17b.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-7b098435d4929af7.js",revision:"_cwShw40bUbOFmeaHw2Il"},{url:"/_next/static/css/167ef756a909ffd2.css",revision:"167ef756a909ffd2"},{url:"/_next/static/css/4836d9950f954ae0.css",revision:"4836d9950f954ae0"},{url:"/_next/static/css/e6272824c998f26e.css",revision:"e6272824c998f26e"},{url:"/_next/static/media/0484562807a97172-s.p.woff2",revision:"b550bca8934bd86812d1f5e28c9cc1de"},{url:"/_next/static/media/c3bc380753a8436c-s.woff2",revision:"5a1b7c983a9dc0a87a2ff138e07ae822"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/_next/static/media/fe0777f1195381cb-s.woff2",revision:"f2a04185547c36abfa589651236a9849"},{url:"/google2682f345c83b7839.html",revision:"1396b19da1e56579b7d899d154b31244"},{url:"/icon512_maskable.png",revision:"e1bc4fe4aa3f21fa2bbcd350b24c16c9"},{url:"/icon512_rounded.png",revision:"85a2f5c8d5265fe33259b0350219cbf2"},{url:"/main_page.png",revision:"85cdd99944d92071061b2b86cf8d3bf4"},{url:"/manifest.json",revision:"8cda205ef03b1593e2c1f59fbee6f9d1"},{url:"/og_image.png",revision:"50de4ccf6d11b171dac3a3f00ce24a22"},{url:"/robots.txt",revision:"d260a412baf7e39121ef768276fe810f"},{url:"/serviceWorker.js",revision:"ffb325d4123247c7adb96cf530403a69"},{url:"/yandex_7f79282e5b5b0673.html",revision:"356f4a088ada98ebeac097ce241720e0"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));

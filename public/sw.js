if (!self.define) {
  let e,
    a = {};
  const s = (s, i) => (
    (s = new URL(s + '.js', i).href),
    a[s] ||
      new Promise(a => {
        if ('document' in self) {
          const e = document.createElement('script');
          ((e.src = s), (e.onload = a), document.head.appendChild(e));
        } else ((e = s), importScripts(s), a());
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, c) => {
    const n =
      e ||
      ('document' in self ? document.currentScript.src : '') ||
      location.href;
    if (a[n]) return;
    let t = {};
    const r = e => s(e, n),
      f = { module: { uri: n }, exports: t, require: r };
    a[n] = Promise.all(i.map(e => f[e] || r(e))).then(e => (c(...e), t));
  };
}
define(['./workbox-1bb06f5e'], function (e) {
  'use strict';
  (importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/AI_logo.json', revision: 'aa5a318fae9bab945d1d48981628ebfb' },
        { url: '/Avatar1.png', revision: '7513eda3ab8cedfb89b43801919e72dc' },
        { url: '/Avatar2.png', revision: '2143e0ed816a27e8d0cccc7afaab2542' },
        {
          url: '/Healthcare_logo.svg',
          revision: 'e4ce46e8894a7a9e874ee63b25337714',
        },
        {
          url: '/_next/app-build-manifest.json',
          revision: '95a7155c89f128aba7fc04e9a14df107',
        },
        {
          url: '/_next/static/Fc5Mgfv4GHGBzYBg2zl9e/_buildManifest.js',
          revision: '886c22b79d2ede33d8d2e34f5e75c95a',
        },
        {
          url: '/_next/static/Fc5Mgfv4GHGBzYBg2zl9e/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/chunks/1157-11997169a6a68458.js',
          revision: '11997169a6a68458',
        },
        {
          url: '/_next/static/chunks/1255-1ba95d892eb26910.js',
          revision: '1ba95d892eb26910',
        },
        {
          url: '/_next/static/chunks/1272-7b097befbe5e63e8.js',
          revision: '7b097befbe5e63e8',
        },
        {
          url: '/_next/static/chunks/1947-fdd70ab871314d63.js',
          revision: 'fdd70ab871314d63',
        },
        {
          url: '/_next/static/chunks/3697-3edd3f172c31fd1c.js',
          revision: '3edd3f172c31fd1c',
        },
        {
          url: '/_next/static/chunks/4141-9e55b6ba9a4f8068.js',
          revision: '9e55b6ba9a4f8068',
        },
        {
          url: '/_next/static/chunks/4193-d11feb8894766673.js',
          revision: 'd11feb8894766673',
        },
        {
          url: '/_next/static/chunks/4601-b4ec114fb7897ca5.js',
          revision: 'b4ec114fb7897ca5',
        },
        {
          url: '/_next/static/chunks/4909-3b4ba2692e7e1291.js',
          revision: '3b4ba2692e7e1291',
        },
        {
          url: '/_next/static/chunks/4bd1b696-f785427dddbba9fb.js',
          revision: 'f785427dddbba9fb',
        },
        {
          url: '/_next/static/chunks/5125-b86eb857041e8852.js',
          revision: 'b86eb857041e8852',
        },
        {
          url: '/_next/static/chunks/522-52091f74f73e2b75.js',
          revision: '52091f74f73e2b75',
        },
        {
          url: '/_next/static/chunks/6332-f4d8905e3bc6767c.js',
          revision: 'f4d8905e3bc6767c',
        },
        {
          url: '/_next/static/chunks/6394-6d62a06ee933528b.js',
          revision: '6d62a06ee933528b',
        },
        {
          url: '/_next/static/chunks/6612-04933812855b2c40.js',
          revision: '04933812855b2c40',
        },
        {
          url: '/_next/static/chunks/6729-af67100de2b5f67e.js',
          revision: 'af67100de2b5f67e',
        },
        {
          url: '/_next/static/chunks/6943-62a961f40832dad0.js',
          revision: '62a961f40832dad0',
        },
        {
          url: '/_next/static/chunks/7240-c7fc924cfa7eb037.js',
          revision: 'c7fc924cfa7eb037',
        },
        {
          url: '/_next/static/chunks/742-e3d9e8e19201f192.js',
          revision: 'e3d9e8e19201f192',
        },
        {
          url: '/_next/static/chunks/7853.70ee67a51d19fa7d.js',
          revision: '70ee67a51d19fa7d',
        },
        {
          url: '/_next/static/chunks/7873.6f8e3b703e65d0e3.js',
          revision: '6f8e3b703e65d0e3',
        },
        {
          url: '/_next/static/chunks/7908-846bf511bc801cb9.js',
          revision: '846bf511bc801cb9',
        },
        {
          url: '/_next/static/chunks/8223-e47e8a342d6cae9a.js',
          revision: 'e47e8a342d6cae9a',
        },
        {
          url: '/_next/static/chunks/8720-d7f67a5726cf715d.js',
          revision: 'd7f67a5726cf715d',
        },
        {
          url: '/_next/static/chunks/932-d0923cb8e3ee50b1.js',
          revision: 'd0923cb8e3ee50b1',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-52151fae3caa751a.js',
          revision: '52151fae3caa751a',
        },
        {
          url: '/_next/static/chunks/app/api/health/route-06a29eb2a1e37add.js',
          revision: '06a29eb2a1e37add',
        },
        {
          url: '/_next/static/chunks/app/auth/callback/page-7c58d8bf9a9bfe9d.js',
          revision: '7c58d8bf9a9bfe9d',
        },
        {
          url: '/_next/static/chunks/app/auth/forgot-password/page-6861ae1e619e8788.js',
          revision: '6861ae1e619e8788',
        },
        {
          url: '/_next/static/chunks/app/auth/google/callback/page-ba0725293ec0595b.js',
          revision: 'ba0725293ec0595b',
        },
        {
          url: '/_next/static/chunks/app/auth/login/page-2808bc44c7652b85.js',
          revision: '2808bc44c7652b85',
        },
        {
          url: '/_next/static/chunks/app/auth/register/page-f4fe95a87170bf5a.js',
          revision: 'f4fe95a87170bf5a',
        },
        {
          url: '/_next/static/chunks/app/auth/resend-verification/page-d3645e5f1f68bf8b.js',
          revision: 'd3645e5f1f68bf8b',
        },
        {
          url: '/_next/static/chunks/app/auth/reset-password/page-fd1a7443d9eac9b7.js',
          revision: 'fd1a7443d9eac9b7',
        },
        {
          url: '/_next/static/chunks/app/auth/verify-email/page-b62eb9a2f9b59dfa.js',
          revision: 'b62eb9a2f9b59dfa',
        },
        {
          url: '/_next/static/chunks/app/chatbox/page-691030ef97f6c89b.js',
          revision: '691030ef97f6c89b',
        },
        {
          url: '/_next/static/chunks/app/dashboard/page-79550870f2436268.js',
          revision: '79550870f2436268',
        },
        {
          url: '/_next/static/chunks/app/eat/page-69f3a61b749992f8.js',
          revision: '69f3a61b749992f8',
        },
        {
          url: '/_next/static/chunks/app/firebase-messaging-sw.js/route-06a29eb2a1e37add.js',
          revision: '06a29eb2a1e37add',
        },
        {
          url: '/_next/static/chunks/app/health-tracking/page-d5348e8255cb45e5.js',
          revision: 'd5348e8255cb45e5',
        },
        {
          url: '/_next/static/chunks/app/layout-44e3b6826129080d.js',
          revision: '44e3b6826129080d',
        },
        {
          url: '/_next/static/chunks/app/manifest.webmanifest/route-06a29eb2a1e37add.js',
          revision: '06a29eb2a1e37add',
        },
        {
          url: '/_next/static/chunks/app/page-e8d6208e3ef0c60a.js',
          revision: 'e8d6208e3ef0c60a',
        },
        {
          url: '/_next/static/chunks/app/practice/page-fd37b868568fe990.js',
          revision: 'fd37b868568fe990',
        },
        {
          url: '/_next/static/chunks/app/predict/page-b6a6ecd024e30382.js',
          revision: 'b6a6ecd024e30382',
        },
        {
          url: '/_next/static/chunks/app/predict/result/page-3d7e2abe35a7fd0d.js',
          revision: '3d7e2abe35a7fd0d',
        },
        {
          url: '/_next/static/chunks/app/profile/page-e8b1e15a81906186.js',
          revision: 'e8b1e15a81906186',
        },
        {
          url: '/_next/static/chunks/app/settings/page-a0a1df810fbbe9c3.js',
          revision: 'a0a1df810fbbe9c3',
        },
        {
          url: '/_next/static/chunks/app/sw.js/route-06a29eb2a1e37add.js',
          revision: '06a29eb2a1e37add',
        },
        {
          url: '/_next/static/chunks/app/workbox-1bb06f5e.js/route-06a29eb2a1e37add.js',
          revision: '06a29eb2a1e37add',
        },
        {
          url: '/_next/static/chunks/dc112a36.d3fd1a2f8f93c92e.js',
          revision: 'd3fd1a2f8f93c92e',
        },
        {
          url: '/_next/static/chunks/framework-b9fffb5537caa07c.js',
          revision: 'b9fffb5537caa07c',
        },
        {
          url: '/_next/static/chunks/main-4ff6d03412d1b164.js',
          revision: '4ff6d03412d1b164',
        },
        {
          url: '/_next/static/chunks/main-app-429ed63da1f2fa5c.js',
          revision: '429ed63da1f2fa5c',
        },
        {
          url: '/_next/static/chunks/pages/_app-6c8c2371b16a04b8.js',
          revision: '6c8c2371b16a04b8',
        },
        {
          url: '/_next/static/chunks/pages/_error-94812ad32cad7365.js',
          revision: '94812ad32cad7365',
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f',
        },
        {
          url: '/_next/static/chunks/webpack-cfc7c23735e8e68e.js',
          revision: 'cfc7c23735e8e68e',
        },
        {
          url: '/_next/static/css/67421bdc9729aefc.css',
          revision: '67421bdc9729aefc',
        },
        {
          url: '/_next/static/css/f1a38a5961790194.css',
          revision: 'f1a38a5961790194',
        },
        {
          url: '/_next/static/media/4af3d503733b6e0d-s.p.otf',
          revision: '1ae06bc5340fe8ecc9689f7435f4d57e',
        },
        {
          url: '/_next/static/media/748dea0022e08f0b-s.p.otf',
          revision: '82e5334b9753f83c1a97ac8419ee3c71',
        },
        {
          url: '/_next/static/media/8baa9efa29f15961-s.p.otf',
          revision: '6655e711b71fad445f2fc2e071ea6f5b',
        },
        {
          url: '/_next/static/media/a233bcf5589f9052-s.p.otf',
          revision: '83a4e50a248e2b9da6b2e6802834646d',
        },
        {
          url: '/apple-touch-icon.png',
          revision: '8300b88265b1b62f5f3a76c0c9c8d6e9',
        },
        { url: '/favicon.svg', revision: 'a6082f3461f851f7f5a07d506b6b3474' },
        { url: '/file.svg', revision: 'd09f95206c3fa0bb9bd9fefabfd0ea71' },
        {
          url: '/firebase-messaging-sw.js',
          revision: '3f8e432c4cfc6ad0c9cb87de83c3b35a',
        },
        {
          url: '/fonts/SVN-Gilroy-Black-Italic.otf',
          revision: '59f76af44fc0b60bc5ca1ac226d92462',
        },
        {
          url: '/fonts/SVN-Gilroy-Black.otf',
          revision: '91508b3f0beef57e1e54b407b0343020',
        },
        {
          url: '/fonts/SVN-Gilroy-Bold-Italic.otf',
          revision: '3f40c274ef9c091c68e34d74e4f104e5',
        },
        {
          url: '/fonts/SVN-Gilroy-Bold.otf',
          revision: '83a4e50a248e2b9da6b2e6802834646d',
        },
        {
          url: '/fonts/SVN-Gilroy-Heavy-Italic.otf',
          revision: '4caa8cff4d726243fd092637ef5a1ba9',
        },
        {
          url: '/fonts/SVN-Gilroy-Heavy.otf',
          revision: 'dcd00d1d23471afc73a55e78bf59fca3',
        },
        {
          url: '/fonts/SVN-Gilroy-Italic.otf',
          revision: 'c3768e33f44d61c676a0247eeb2e5b70',
        },
        {
          url: '/fonts/SVN-Gilroy-Light-Italic.otf',
          revision: 'c5e9ddb27b3a84f9a2a8aa1879794a50',
        },
        {
          url: '/fonts/SVN-Gilroy-Light.otf',
          revision: '500ee3f8d1beb34b515976e9b27e3706',
        },
        {
          url: '/fonts/SVN-Gilroy-Medium-Italic.otf',
          revision: 'ebefcaca02270f061c6a55d57e0e31a7',
        },
        {
          url: '/fonts/SVN-Gilroy-Medium.otf',
          revision: '1ae06bc5340fe8ecc9689f7435f4d57e',
        },
        {
          url: '/fonts/SVN-Gilroy-Regular.otf',
          revision: '6655e711b71fad445f2fc2e071ea6f5b',
        },
        {
          url: '/fonts/SVN-Gilroy-SemiBold-Italic.otf',
          revision: '7bc3fa7432dbbe53aca7f864d9352845',
        },
        {
          url: '/fonts/SVN-Gilroy-SemiBold.otf',
          revision: '82e5334b9753f83c1a97ac8419ee3c71',
        },
        {
          url: '/fonts/SVN-Gilroy-Thin-Italic.otf',
          revision: 'cfcf7956ff37267687c865cf4c6b0326',
        },
        {
          url: '/fonts/SVN-Gilroy-Thin.otf',
          revision: 'd77450bfee1e54ea478b559bc390d078',
        },
        {
          url: '/fonts/SVN-Gilroy-XBold-Italic.otf',
          revision: 'ce2a7b77ebd0d680953e8e1f8963a8e7',
        },
        {
          url: '/fonts/SVN-Gilroy-XBold.otf',
          revision: 'c37c61167ee0b1b418f983f2f9a180b5',
        },
        {
          url: '/fonts/SVN-Gilroy-Xlight-Italic.otf',
          revision: '4f186c7835190684e3d489ccb59bc220',
        },
        {
          url: '/fonts/SVN-Gilroy-Xlight.otf',
          revision: '8bd3fe58633f8bc4b21e081ce4f8cddd',
        },
        { url: '/globe.svg', revision: '2aaafa6a49b6563925fe440891e32717' },
        { url: '/google.svg', revision: 'fdb3f7bba9fb5542787dfd116449ee05' },
        {
          url: '/healthcare-image1.png',
          revision: 'f39d2edfdfe3b6fb8a254855b29db76b',
        },
        {
          url: '/healthcare_image2.png',
          revision: '633f9ac19300349450c6139e1cb96d23',
        },
        {
          url: '/healthcare_image3.png',
          revision: '593ca2fd12f0f4b99e0cf414edbfccfb',
        },
        {
          url: '/icons/Decorate1.svg',
          revision: 'bacddc66f8a834a5d23fc0e56d048ab0',
        },
        {
          url: '/icons/Decorate2.svg',
          revision: '36a73dc20611b1f53afa1b2c2c9a7aa0',
        },
        {
          url: '/icons/Decorate3.svg',
          revision: '9004b6a29c08048dd5f7658d65bd167c',
        },
        {
          url: '/icons/Feedback.svg',
          revision: 'acbfb0b37e4152ac38b67ff2ae688f5f',
        },
        {
          url: '/icons/activity.svg',
          revision: '97735789ea976cd9f94e4fb34482b4d9',
        },
        {
          url: '/icons/attachment.svg',
          revision: 'db6c32e6d8c894d0db377d5dd0683eb3',
        },
        {
          url: '/icons/badge-72x72.png',
          revision: '520b892ac0e990637754fdec59425c41',
        },
        {
          url: '/icons/check.svg',
          revision: '36660aed112b28b0ba44a350edae8c49',
        },
        {
          url: '/icons/close.svg',
          revision: 'dae1bb3d663718d1c1041ec412b5c541',
        },
        {
          url: '/icons/copy.svg',
          revision: 'd51aca6fbaed9bc32ab11c897b74d48f',
        },
        {
          url: '/icons/edit.svg',
          revision: '3e51cd52601808e7ba703d13fc66abca',
        },
        {
          url: '/icons/google.svg',
          revision: '1e7030e2cc47c4bff63a0490e710d8d4',
        },
        {
          url: '/icons/heart.svg',
          revision: '3730e98ce413558359aceadb5910c0c7',
        },
        {
          url: '/icons/icon-128x128.png',
          revision: '08ac926fedd7051e58f4c4e077c33e56',
        },
        {
          url: '/icons/icon-144x144.png',
          revision: '556266228bf0776bdb216f99b2d9a45b',
        },
        {
          url: '/icons/icon-152x152.png',
          revision: 'dbe6bcaf9cb573e5e7dea2b9f1582240',
        },
        {
          url: '/icons/icon-180x180.png',
          revision: '8300b88265b1b62f5f3a76c0c9c8d6e9',
        },
        {
          url: '/icons/icon-192x192.png',
          revision: '444f2c1ab1a2838ca506cea5b154df4c',
        },
        {
          url: '/icons/icon-384x384.png',
          revision: 'c89ce1e479b5143f1f4d22b628dba811',
        },
        {
          url: '/icons/icon-512x512.png',
          revision: 'ad828f3c66759461f2e0a91aeb1935de',
        },
        {
          url: '/icons/icon-72x72.png',
          revision: '13e968b72fe281d29b09dcc59490ced4',
        },
        {
          url: '/icons/icon-96x96.png',
          revision: '9212a814af3ac9fc69ac23e391da7f83',
        },
        {
          url: '/icons/icon-source.svg',
          revision: '353da95fd2c2cf965439a517f7e80ae3',
        },
        {
          url: '/icons/regenerate.svg',
          revision: 'a74a35394db927e05dec52603f091091',
        },
        {
          url: '/icons/send.svg',
          revision: 'ba7963f65fc1bef4a1015d0d7049236c',
        },
        {
          url: '/icons/shield-check.svg',
          revision: '593c5aa9b1cddc56bebe33b0f4020266',
        },
        {
          url: '/images/account_icon.png',
          revision: 'aaadc49854de42146e68bde7f4e1da16',
        },
        {
          url: '/images/medical-physician-doctor-man.png',
          revision: 'ec6ddcdfa2d4696e1f0da263e7a6f7c1',
        },
        { url: '/next.svg', revision: '8e061864f388b47f33a1c3780831193e' },
        { url: '/vercel.svg', revision: 'c0af2f507b369b085b35ef4bbe3bcf1e' },
        { url: '/window.svg', revision: 'a2760511c65806022ad20adf74370ff3' },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: a,
              event: s,
              state: i,
            }) =>
              a && 'opaqueredirect' === a.type
                ? new Response(a.body, {
                    status: 200,
                    statusText: 'OK',
                    headers: a.headers,
                  })
                : a,
          },
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const a = e.pathname;
        return !a.startsWith('/api/auth/') && !!a.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      'GET'
    ));
});

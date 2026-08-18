const CACHE='auto-budget-v1';
const ASSETS=['.','index.html','Auto_Budget_Rechner.html','manifest.webmanifest','icon.svg'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.filter(Boolean))).catch(()=>{}));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  e.respondWith(
    caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
      return res;
    }).catch(()=>caches.match('Auto_Budget_Rechner.html')))
  );
});

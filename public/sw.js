self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("static").then((cache) => {
      console.log(cache);
      return cache.addAll([
        "./",
        "./css/styles.css",
        "./images/icon-1.png",
        "./images/icon-2.webp",
        "./images/icon-3.png",
        "./images/shop.png",
        "./index.js",
        "./js/classes.js",
        "./js/utils.js",
        "./index.html",
        "./images/Goblin/Attack.png",
        "./images/Goblin/Death.png",
        "./images/Goblin/Idle.png",
        "./images/Goblin/Run.png",
        "./images/Goblin/Take Hit.png",
        "./images/kenji/Attack1.png",
        "./images/kenji/Attack2.png",
        "./images/kenji/Fall.png",
        "./images/kenji/Jump.png",
        "./images/kenji/Death.png",
        "./images/kenji/Idle.png",
        "./images/kenji/Run.png",
        "./images/kenji/Take Hit.png",
        "./images/background.png",
        "./images/city.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});

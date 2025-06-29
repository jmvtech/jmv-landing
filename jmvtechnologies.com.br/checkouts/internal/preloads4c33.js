
    (function() {
      var assetsBase = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/polyfills-legacy.BnscUFq0.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/app-legacy.D4FaWRtX.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/page-OnePage-legacy.CBOsmBir.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/DeliveryMethodSelectorSection-legacy.PBsBnC56.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/useEditorShopPayNavigation-legacy.DmV-l35a.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/VaultedPayment-legacy.BHEldPrK.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/LocalizationExtensionField-legacy.DRrKXXtt.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/ShopPayOptInDisclaimer-legacy.ClNqSYwS.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/ShipmentBreakdown-legacy.BznawY3I.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/MerchandiseModal-legacy.BZt2eelg.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/StackedMerchandisePreview-legacy.J3Dt0D2c.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/PayButtonSection-legacy.BlYE5HeX.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/component-ShopPayVerificationSwitch-legacy.DzhsPka_.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/useSubscribeMessenger-legacy.D5UGGGL0.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/c1.pt-BR/index-legacy.B29CWCKy.js"];
      var styles = [];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = [];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [assetsBase].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  
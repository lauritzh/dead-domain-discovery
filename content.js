//
// (c) Lauritz Holtmann
//

function isHttpUrl(url) {
  return url.startsWith('http://') || url.startsWith('https://');
}

function scanPage() {
  const resources = {
    iframes: [],
    scripts: [],
    styles: [],
    anchors: [],
    objects: [],
    images: [],
    videos: [],
    audios: []
  };

  const pageUrl = window.location.href;

  // Collect iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src;
    if (src && isHttpUrl(src)) {
      resources.iframes.push({ url: src, element: 'iframe' });
    }
  });

  // Collect scripts
  document.querySelectorAll('script').forEach(script => {
    const src = script.src;
    if (src && isHttpUrl(src)) {
      resources.scripts.push({ url: src, element: 'script' });
    }
  });

  // Collect styles
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.href;
    if (href && isHttpUrl(href)) {
      resources.styles.push({ url: href, element: 'link[rel="stylesheet"]' });
    }
  });

  // Collect anchor tags
  document.querySelectorAll('a').forEach(anchor => {
    const href = anchor.href;
    if (href && isHttpUrl(href)) {
      resources.anchors.push({ url: href, element: 'a' });
    }
  });

  // Collect object tags
  document.querySelectorAll('object').forEach(object => {
    const data = object.data;
    if (data && isHttpUrl(data)) {
      resources.objects.push({ url: data, element: 'object' });
    }
  });

  // Collect image tags
  document.querySelectorAll('img').forEach(img => {
    const src = img.src;
    if (src && isHttpUrl(src)) {
      resources.images.push({ url: src, element: 'img' });
    }
  });

  // Collect video tags
  document.querySelectorAll('video').forEach(video => {
    const src = video.src;
    if (src && isHttpUrl(src)) {
      resources.videos.push({ url: src, element: 'video' });
    }
    // Check for sources within <source> tags
    video.querySelectorAll('source').forEach(source => {
      const src = source.src;
      if (src && isHttpUrl(src)) {
        resources.videos.push({ url: src, element: 'video > source' });
      }
    });
  });

  // Collect audio tags
  document.querySelectorAll('audio').forEach(audio => {
    const src = audio.src;
    if (src && isHttpUrl(src)) {
      resources.audios.push({ url: src, element: 'audio' });
    }
    // Check for sources within <source> tags
    audio.querySelectorAll('source').forEach(source => {
      const src = source.src;
      if (src && isHttpUrl(src)) {
        resources.audios.push({ url: src, element: 'audio > source' });
      }
    });
  });

  console.log('External resources:', resources);

  const domains = [
    ...resources.iframes,
    ...resources.scripts,
    ...resources.styles,
    ...resources.anchors,
    ...resources.objects,
    ...resources.images,
    ...resources.videos,
    ...resources.audios
  ].map(resource => ({
    domain: (new URL(resource.url)).hostname,
    pageUrl: pageUrl,
    sinkElement: resource.element
  }));

  chrome.runtime.sendMessage({ type: 'checkDomains', domains: domains });
}

scanPage();

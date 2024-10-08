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

  // Collect iframes
  document.querySelectorAll('iframe').forEach(iframe => {
    const src = iframe.src;
    if (src && isHttpUrl(src)) {
      resources.iframes.push(src);
    }
  });

  // Collect scripts
  document.querySelectorAll('script').forEach(script => {
    const src = script.src;
    if (src && isHttpUrl(src)) {
      resources.scripts.push(src);
    }
  });

  // Collect styles
  document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.href;
    if (href && isHttpUrl(href)) {
      resources.styles.push(href);
    }
  });

  // Collect anchor tags
  document.querySelectorAll('a').forEach(anchor => {
    const href = anchor.href;
    if (href && isHttpUrl(href)) {
      resources.anchors.push(href);
    }
  });

  // Collect object tags
  document.querySelectorAll('object').forEach(object => {
    const data = object.data;
    if (data && isHttpUrl(data)) {
      resources.objects.push(data);
    }
  });

  // Collect image tags
  document.querySelectorAll('img').forEach(img => {
    const src = img.src;
    if (src && isHttpUrl(src)) {
      resources.images.push(src);
    }
  });

  // Collect video tags
  document.querySelectorAll('video').forEach(video => {
    const src = video.src;
    if (src && isHttpUrl(src)) {
      resources.videos.push(src);
    }
    // Check for sources within <source> tags
    video.querySelectorAll('source').forEach(source => {
      const src = source.src;
      if (src && isHttpUrl(src)) {
        resources.videos.push(src);
      }
    });
  });

  // Collect audio tags
  document.querySelectorAll('audio').forEach(audio => {
    const src = audio.src;
    if (src && isHttpUrl(src)) {
      resources.audios.push(src);
    }
    // Check for sources within <source> tags
    audio.querySelectorAll('source').forEach(source => {
      const src = source.src;
      if (src && isHttpUrl(src)) {
        resources.audios.push(src);
      }
    });
  });

  console.log('External resources:', resources);

  const urls = [
    ...resources.iframes,
    ...resources.scripts,
    ...resources.styles,
    ...resources.anchors,
    ...resources.objects,
    ...resources.images,
    ...resources.videos,
    ...resources.audios
  ];
  
  const domains = Array.from(new Set(urls.map(url => (new URL(url)).hostname)));

  chrome.runtime.sendMessage({ type: 'checkDomains', domains: domains });
}

scanPage();

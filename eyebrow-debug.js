// Eyebrow Debug Script
// Paste in browser console to diagnose eyebrow styling issues

(function() {
  const result = {
    timestamp: new Date().toISOString(),
    eyebrows: []
  };

  // Find all eyebrows on page
  const eyebrows = document.querySelectorAll('.eyebrow');

  eyebrows.forEach((eyebrow, index) => {
    const rect = eyebrow.getBoundingClientRect();
    const computed = window.getComputedStyle(eyebrow);
    const computedBefore = window.getComputedStyle(eyebrow, '::before');

    // Find parent context
    let context = 'unknown';
    if (eyebrow.closest('.widget-newsletter')) context = 'newsletter-widget';
    else if (eyebrow.closest('.popular-widget')) context = 'popular-widget';
    else if (eyebrow.closest('.toc-wrapper')) context = 'toc';

    const inlineColor = eyebrow.style.color || 'none';

    const eyebrowInfo = {
      index,
      context,
      isVisible: rect.width > 0 && rect.height > 0,
      inlineStyle: {
        color: inlineColor
      },
      computedStyle: {
        color: computed.color,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        letterSpacing: computed.letterSpacing,
        gap: computed.gap,
        display: computed.display,
        alignItems: computed.alignItems
      },
      beforePseudoElement: {
        // These are computed but may not show all details
        content: computedBefore.content,
        background: computedBefore.background,
        width: computedBefore.width,
        height: computedBefore.height,
        display: computedBefore.display
      },
      html: eyebrow.outerHTML.substring(0, 200),
      textContent: eyebrow.textContent
    };

    result.eyebrows.push(eyebrowInfo);
  });

  // Also check for any CSS rules affecting .eyebrow
  result.stylesheets = [];

  try {
    for (let sheet of document.styleSheets) {
      try {
        for (let rule of sheet.cssRules) {
          if (rule.selectorText && rule.selectorText.includes('eyebrow')) {
            result.stylesheets.push({
              href: sheet.href || 'inline',
              selector: rule.selectorText,
              cssText: rule.cssText.substring(0, 500)
            });
          }
        }
      } catch (e) {
        // CORS restrictions on external sheets
      }
    }
  } catch (e) {
    result.stylesheets_error = 'Could not access stylesheets (CORS)';
  }

  console.log('=== EYEBROW DEBUG INFO ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('Copy the above JSON and share with assistant');

  return result;
})();

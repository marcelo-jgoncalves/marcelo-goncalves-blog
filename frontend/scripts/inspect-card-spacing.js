const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    // Not every card has an excerpt: pick the first one that does, so the
    // measurement below reflects the excerpt spacing, not an empty gap.
    const cards = Array.from(document.querySelectorAll('.post-card__content'));
    const card = cards.find(c => c.querySelector('.post-card__excerpt')) || cards[1];
    if (!card) return { error: 'card with excerpt not found' };

    const title   = card.querySelector('.post-card__title');
    const excerpt = card.querySelector('.post-card__excerpt');
    const cta     = card.querySelector('.post-card__cta');

    const fullInfo = (el, label) => {
      if (!el) return { label, error: 'not found' };
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return {
        label,
        tag: el.tagName,
        rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) },
        margin: { top: cs.marginTop, bottom: cs.marginBottom },
        padding: { top: cs.paddingTop, bottom: cs.paddingBottom },
        fontSize: cs.fontSize,
        lineHeight: cs.lineHeight,
        display: cs.display,
        webkitLineClamp: cs.webkitLineClamp,
      };
    };

    const t = fullInfo(title, 'title');
    const e = fullInfo(excerpt, 'excerpt');
    const c = fullInfo(cta, 'cta');

    const cardCs = window.getComputedStyle(card);

    return {
      container: {
        display: cardCs.display,
        flexDirection: cardCs.flexDirection,
        gap: cardCs.gap,
        padding: cardCs.padding,
      },
      title: t,
      excerpt: e,
      cta: c,
      measuredGapTitleExcerpt: Math.round(e.rect.top - t.rect.bottom),
      measuredGapExcerptCta:   Math.round(c.rect.top - e.rect.bottom),
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();

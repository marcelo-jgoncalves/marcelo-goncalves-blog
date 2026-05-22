// Detailed eyebrow inspection comparing Newsletter vs Projeto widgets
// Run this in browser console on home page

(function() {
  const nl = document.querySelector('.widget-newsletter .eyebrow');
  const proj = document.querySelector('.projeto-widget .eyebrow');

  if (!nl || !proj) {
    console.log('Could not find both eyebrows');
    return;
  }

  console.log('=== DETAILED EYEBROW COMPARISON ===\n');

  // Check parent containers
  console.log('NEWSLETTER WIDGET:');
  const nlWidget = nl.closest('.widget-newsletter');
  console.log('Parent display:', window.getComputedStyle(nlWidget).display);
  console.log('Parent text-align:', window.getComputedStyle(nlWidget).textAlign);
  console.log('Parent overflow:', window.getComputedStyle(nlWidget).overflow);
  console.log('Parent position:', window.getComputedStyle(nlWidget).position);
  console.log('Parent background:', window.getComputedStyle(nlWidget).backgroundColor);

  console.log('\nPROJETO WIDGET:');
  const projWidget = proj.closest('.projeto-widget');
  console.log('Parent display:', window.getComputedStyle(projWidget).display);
  console.log('Parent text-align:', window.getComputedStyle(projWidget).textAlign);
  console.log('Parent overflow:', window.getComputedStyle(projWidget).overflow);
  console.log('Parent position:', window.getComputedStyle(projWidget).position);
  console.log('Parent background:', window.getComputedStyle(projWidget).backgroundColor);

  // Check eyebrow element properties
  console.log('\n=== EYEBROW ELEMENT PROPERTIES ===\n');

  console.log('NEWSLETTER EYEBROW:');
  const nlStyle = window.getComputedStyle(nl);
  console.log('display:', nlStyle.display);
  console.log('flex-direction:', nlStyle.flexDirection);
  console.log('justify-content:', nlStyle.justifyContent);
  console.log('align-items:', nlStyle.alignItems);
  console.log('gap:', nlStyle.gap);
  console.log('margin-bottom:', nlStyle.marginBottom);
  console.log('text-align:', nlStyle.textAlign);

  console.log('\nPROJETO EYEBROW:');
  const projStyle = window.getComputedStyle(proj);
  console.log('display:', projStyle.display);
  console.log('flex-direction:', projStyle.flexDirection);
  console.log('justify-content:', projStyle.justifyContent);
  console.log('align-items:', projStyle.alignItems);
  console.log('gap:', projStyle.gap);
  console.log('margin-bottom:', projStyle.marginBottom);
  console.log('text-align:', projStyle.textAlign);

  // Check ::before pseudo-element
  console.log('\n=== ::BEFORE PSEUDO-ELEMENT ===\n');

  console.log('NEWSLETTER ::BEFORE:');
  const nlBefore = window.getComputedStyle(nl, '::before');
  console.log('width:', nlBefore.width);
  console.log('height:', nlBefore.height);
  console.log('background:', nlBefore.background);
  console.log('display:', nlBefore.display);
  console.log('flex-shrink:', nlBefore.flexShrink);
  console.log('order:', nlBefore.order);

  console.log('\nPROJETO ::BEFORE:');
  const projBefore = window.getComputedStyle(proj, '::before');
  console.log('width:', projBefore.width);
  console.log('height:', projBefore.height);
  console.log('background:', projBefore.background);
  console.log('display:', projBefore.display);
  console.log('flex-shrink:', projBefore.flexShrink);
  console.log('order:', projBefore.order);

  // Check visual properties
  console.log('\n=== VISUAL CHECKS ===\n');

  console.log('NEWSLETTER:');
  console.log('Element client rect:', {
    top: nl.getBoundingClientRect().top,
    left: nl.getBoundingClientRect().left,
    width: nl.getBoundingClientRect().width,
    height: nl.getBoundingClientRect().height
  });

  console.log('\nPROJETO:');
  console.log('Element client rect:', {
    top: proj.getBoundingClientRect().top,
    left: proj.getBoundingClientRect().left,
    width: proj.getBoundingClientRect().width,
    height: proj.getBoundingClientRect().height
  });

  // Check if eyebrow is visible in the viewport
  console.log('\n=== VISUAL HIERARCHY ===\n');
  console.log('NEWSLETTER Eyebrow position in flex order:', {
    order: nlBefore.order,
    flex_grow: nlBefore.flexGrow,
    flex_shrink: nlBefore.flexShrink,
    flex_basis: nlBefore.flexBasis
  });

  console.log('PROJETO Eyebrow position in flex order:', {
    order: projBefore.order,
    flex_grow: projBefore.flexGrow,
    flex_shrink: projBefore.flexShrink,
    flex_basis: projBefore.flexBasis
  });

  // Save for future reference
  window.eyebrowInspection = { nl, proj, nlWidget, projWidget };
})();

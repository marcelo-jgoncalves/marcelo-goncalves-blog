// Verification script: Check if eyebrow fade appears in both widgets after CSS fix
// Run in browser console on a post page after changes reload

(function() {
  console.log('=== EYEBROW VISIBILITY CHECK ===\n');

  // Find both eyebrows
  const nlEyebrow = document.querySelector('.widget-newsletter .eyebrow');
  const projEyebrow = document.querySelector('.projeto-widget .eyebrow');

  if (!nlEyebrow || !projEyebrow) {
    console.log('ERROR: Could not find both eyebrows');
    console.log('Newsletter eyebrow found:', !!nlEyebrow);
    console.log('Projeto eyebrow found:', !!projEyebrow);
    return;
  }

  console.log('✓ Both eyebrows found\n');

  // Check if text-align is still present
  const nlWidget = nlEyebrow.closest('.widget-newsletter');
  const projWidget = projEyebrow.closest('.projeto-widget');

  console.log('NEWSLETTER WIDGET text-align:', window.getComputedStyle(nlWidget).textAlign);
  console.log('PROJETO WIDGET text-align:', window.getComputedStyle(projWidget).textAlign);

  // Check eyebrow computed styles
  console.log('\nEYEBROW ELEMENT STYLES:');
  const nlStyle = window.getComputedStyle(nlEyebrow);
  const projStyle = window.getComputedStyle(projEyebrow);

  console.log('Newsletter eyebrow text-align:', nlStyle.textAlign);
  console.log('Projeto eyebrow text-align:', projStyle.textAlign);

  // Check ::before styles
  console.log('\n::BEFORE PSEUDO-ELEMENT STYLES:');
  const nlBefore = window.getComputedStyle(nlEyebrow, '::before');
  const projBefore = window.getComputedStyle(projEyebrow, '::before');

  console.log('Newsletter ::before background:', nlBefore.background.substring(0, 100) + '...');
  console.log('Projeto ::before background:', projBefore.background.substring(0, 100) + '...');

  console.log('\n=== VISUAL TEST ===');
  console.log('Look at both widgets and verify:');
  console.log('1. Newsletter widget (in footer): Does the eyebrow line fade effect appear?');
  console.log('2. Projeto widget (in sidebar): Does the eyebrow line fade effect appear?');
  console.log('\nIf both show the fade effect consistently, the fix is successful.');

  // Highlight the widgets for easy inspection
  nlWidget.style.outline = '2px solid red';
  nlWidget.style.outlineOffset = '-2px';
  projWidget.style.outline = '2px solid green';
  projWidget.style.outlineOffset = '-2px';

  console.log('\n[Red outline = Newsletter widget, Green outline = Projeto widget]');
})();

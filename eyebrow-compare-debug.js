// Eyebrow Debug - Compare Newsletter vs Projeto
(function() {
  const result = { newsletter: null, projeto: null };

  // Eyebrow do Newsletter
  const nlEyebrow = document.querySelector('.widget-newsletter .eyebrow');
  if (nlEyebrow) {
    const computed = window.getComputedStyle(nlEyebrow);
    const before = window.getComputedStyle(nlEyebrow, '::before');
    result.newsletter = {
      element: nlEyebrow.outerHTML.substring(0, 150),
      computedColor: computed.color,
      beforeBackground: before.background,
      beforeWidth: before.width,
      beforeHeight: before.height,
      beforeDisplay: before.display,
      beforeContent: before.content
    };
  }

  // Eyebrow do Projeto
  const projEyebrow = document.querySelector('.projeto-widget .eyebrow');
  if (projEyebrow) {
    const computed = window.getComputedStyle(projEyebrow);
    const before = window.getComputedStyle(projEyebrow, '::before');
    result.projeto = {
      element: projEyebrow.outerHTML.substring(0, 150),
      computedColor: computed.color,
      beforeBackground: before.background,
      beforeWidth: before.width,
      beforeHeight: before.height,
      beforeDisplay: before.display,
      beforeContent: before.content
    };
  }

  console.log('=== EYEBROW COMPARISON ===');
  console.log(JSON.stringify(result, null, 2));
  window.eyebrowCompare = result;
})();

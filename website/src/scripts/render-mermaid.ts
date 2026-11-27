async function renderMermaid(): Promise<void> {
  const blocks = document.querySelectorAll('.markdown-body pre > code.language-mermaid');
  if (blocks.length === 0) return;

  const { default: mermaid } = await import('mermaid');
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    suppressErrorRendering: true,
    flowchart: { useMaxWidth: false },
    sequence: { useMaxWidth: false, wrap: true, width: 110, actorMargin: 30 },
  });

  for (const [index, code] of blocks.entries()) {
    const pre = code.parentElement;
    const source = code.textContent;
    if (!pre || !source) continue;

    try {
      const { svg } = await mermaid.render(`docs-mermaid-${index}`, source);
      const figure = document.createElement('figure');
      figure.className = 'mermaid-diagram';
      figure.tabIndex = 0;
      figure.innerHTML = svg;
      const titleId = figure.querySelector('svg')?.getAttribute('aria-labelledby');
      if (titleId) {
        figure.setAttribute('aria-labelledby', titleId);
      } else {
        figure.setAttribute('aria-label', 'Mermaid diagram');
      }
      const hadFocus = pre.contains(document.activeElement);
      pre.replaceWith(figure);
      if (hadFocus) figure.focus({ preventScroll: true });
    } catch (error) {
      console.warn('Could not render a Mermaid diagram.', error);
    }
  }
}

renderMermaid().catch((error) => {
  console.warn('Could not load Mermaid.', error);
});

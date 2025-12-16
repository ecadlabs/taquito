import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';

function highlightCodeBlocks() {
  document.querySelectorAll(".markdown-body pre code").forEach((code) => {
    if (code.classList.contains('prism-highlighted')) {
      return;
    }
    
    const pre = code.parentElement;
    if (!pre) {
      return;
    }
    
    const getLanguageFromElement = (element: Element): string => {
      const classList = element.className.split(' ');
      const langClass = classList.find(cls => cls.startsWith('language-'));
      return langClass ? langClass.replace('language-', '') : '';
    };
    
    let language = getLanguageFromElement(code) || getLanguageFromElement(pre);
    
    if (!language) {
      const combinedClasses = `${code.className} ${pre.className}`;
      if (combinedClasses.includes('js') || combinedClasses.includes('javascript')) {
        language = 'javascript';
      } else if (combinedClasses.includes('ts') || combinedClasses.includes('typescript')) {
        language = 'typescript';
      } else {
        language = 'javascript';
      }
    }
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'javascript': 'javascript',
      'ts': 'typescript',
      'typescript': 'typescript',
    };
    
    const prismLanguage = languageMap[language.toLowerCase()] || language;
    
    const codeText = code.textContent || '';
    
    if (Prism.languages[prismLanguage] || Prism.languages.javascript) {
      const lang = Prism.languages[prismLanguage] || Prism.languages.javascript;
      const highlighted = Prism.highlight(codeText, lang, prismLanguage);
      code.innerHTML = highlighted;
      code.className = `language-${prismLanguage} prism-highlighted`;
      if (!pre.className.includes('language-')) {
        pre.className = pre.className ? `${pre.className} language-${prismLanguage}` : `language-${prismLanguage}`;
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', highlightCodeBlocks);
} else {
  highlightCodeBlocks();
}


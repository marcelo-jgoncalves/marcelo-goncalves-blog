// frontend/public/js/copy-code.js

document.addEventListener('DOMContentLoaded', () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // O botão está dentro de .code-wrapper > .code-header
            // O código <pre><code> está logo abaixo do header
            const codeWrapper = button.closest('.code-wrapper');
            if (!codeWrapper) return;

            const codeBlock = codeWrapper.querySelector('pre.code-block code');
            if (!codeBlock) return;

            // Pega o texto do código
            const codeText = codeBlock.innerText;

            // Usa a API Clipboard moderna para copiar
            navigator.clipboard.writeText(codeText)
                .then(() => {
                    // Feedback visual
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    
                    setTimeout(() => {
                        button.innerHTML = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Falha ao copiar: ', err);
                });
        });
    });
});
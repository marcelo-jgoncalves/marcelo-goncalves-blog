Gemini said
Excelente. O fato de você ter tido a cautela de documentar isso antes de seguirmos em frente é exatamente o que diferencia um projeto que sobrevive ao longo prazo de um que afunda em dívida técnica.

Aqui está o relatório técnico, direto ao ponto e focado no pragmatismo, formatado em Markdown para você copiar e colar diretamente no seu toDos.txt ou sprint-backlogv2.pdf.

📝 Technical Debt: Exposição Direta da Lambda SSR (Next.js)
Contexto Atual: No ambiente de Desenvolvimento, a AWS Lambda que renderiza o Next.js (SSR) está configurada com uma Function URL pública (authorization_type = "NONE" e Principal = "*" no IAM). Isso foi necessário temporariamente para debugar o frontend sem a interferência do cache do CloudFront.

O Problema (Vulnerabilidade Arquitetural): Ao manter a URL da Lambda aberta para a internet, estamos permitindo que qualquer requisição ignore o CloudFront. O CloudFront atua como nosso escudo primário: ele absorve ataques DDoS, filtra tráfego malicioso (se tiver WAF) e, mais importante, serve a página em cache, poupando processamento (e dinheiro).

Impacto (Risco Financeiro em Produção): Se essa configuração for promovida para Produção (PRD), estaremos vulneráveis a um ataque de Denial of Wallet (DoW). Bots ou scripts maliciosos podem descobrir o endpoint direto da Lambda (https://<id>.lambda-url.us-east-1.on.aws/) e inundá-lo com requisições. Como a Lambda escala automaticamente, a AWS vai processar cada requisição de SSR (que consome muita CPU/RAM), gerando uma conta astronômica no fim do mês sem que o nosso domínio oficial receba um único acesso legítimo.

Ação de Correção Recomendada (Antes do Go-Live PRD):

Padrão OAC: Configurar o CloudFront com Origin Access Control (OAC) para assinar as requisições enviadas à Lambda Function URL.

Restrição no IAM: Alterar a aws_lambda_permission no Terraform para que a Lambda aceite APENAS invocações cuja assinatura criptográfica corresponda ao nosso CloudFront, bloqueando acessos públicos diretos.

Severidade: Alta (Apenas para Produção. Aceitável em ambiente Dev isolado).



Deu certo. Agora preciso que você gere o prompt inicial para a próxima IA engenheira seguir com a próxima tarefa. ele deve contar a stack do projeto. Os arquvos necessários para a tarefa que vou informar a seguir, a persona que a IA deverá assumir e demais informações que você achar importante informar para o contexto da tarefa, especificamente.  A tarefa é a segunte
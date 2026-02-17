# Documentação de Funcionalidades de Acessibilidade - VinculoTEA

Este documento descreve todas as funcionalidades de acessibilidade implementadas no projeto VinculoTEA (v5.0), bem como sugestões para melhorias futuras e expansão do sistema.

## 🟢 Funcionalidades Existentes

O sistema de acessibilidade é gerenciado através do `AccessibilityContext` e controlado pelo componente visual `AccessibilityMenu`. Ele é dividido em perfis pré-configurados e ajustes granulares organizados por categorias.

### 1. Perfis de Acessibilidade (Presets)
Estes perfis ativam conjuntos de configurações recomendadas para necessidades específicas com um único clique.

| Perfil | Descrição | Funcionalidades Ativadas |
| :--- | :--- | :--- |
| **Autismo (TEA)** | Foco na calma e redução de estímulos. | Modo Simplificado, Cores Suaves, Sem Distrações. |
| **Deficiência Visual** | Para usuários cegos ou com visão residual. | Leitor de Tela (Simples), Feedback Sonoro, Navegação por Teclado. |
| **Baixa Visão** | Para quem precisa de ampliação e contraste. | Zoom (Lupa), Alto Contraste (Amarelo/Preto), Cursor Grande. |
| **Daltonismo** | Correção de percepção de cores. | Filtros de Cor (ajustável), Saturação ajustada. |
| **Auditivo (Surdo)** | Para usuários surdos ou ensurdecidos. | Widget VLibras, Notificações Visuais, Legendas. |
| **TDAH** | Foco na tarefa e leitura. | Régua de Leitura, Ocultar Imagens, Sem Animações. |
| **Dislexia** | Auxílio específico para leitura. | Fonte OpenDyslexic, Espaçamento Largo, Destaque de Sílabas. |
| **Alfabetização** | Para aprendizes e letramento. | Dicionário Simples, Imagens de Apoio, Fontes Amigáveis. |
| **Motor / Idoso** | Facilidade de interação física. | Botões Gigantes, Atraso de Clique, Grade de Mouse. |
| **Epilepsia** | Segurança contra fotosensibilidade. | Bloqueio de piscas/flashes, Redução de Brilho, Pausa em Vídeos. |

---

### 2. Ferramentas Cognitivas e de Leitura (Tab: Leitura)
Focadas em processamento de informação, foco e compreensão.

*   **Tamanho do Texto**: Ajuste percentual da fonte (Aumentar/Diminuir).
*   **Seletor de Fontes**:
    *   *Padrão*: Fonte do sistema.
    *   *OpenDyslexic*: Fonte projetada para dislexia.
    *   *Arial*: Fonte sans-serif padrão e limpa.
    *   *Comic Sans*: Fonte amigável e de fácil leitura.
*   **Espaçamento**: Ajuste do espaçamento entre linhas e palavras (Normal, Largo, Extra Largo).
*   **Modo Dislexia**: Combinação de fonte e espaçamento.
*   **Guia de Leitura**: Uma "régua" virtual que destaca a linha onde o mouse passa, escurecendo o resto.
*   **Modo Simplificado**: Remove elementos decorativos, focando no conteúdo central.
*   **Estrutura do Site**: Exibe visualmente a hierarquia da página.
*   **Resumo de Página**: (Placeholder) Resumo do conteúdo principal.
*   **Destaque de Sílabas**: Separação visual de sílabas nas palavras.
*   **Dicionário**: (Placeholder) Definições simples ao passar o mouse.
*   **Sem Distrações**: Oculta barras laterais e menus não essenciais.
*   **Velocidade de Voz (TTS)**: Controle de velocidade para o leitor de tela (0.5x a 2.0x).

### 3. Ferramentas Visuais (Tab: Visual)
Focadas em visão, contraste e cor.

*   **Temas de Alto Contraste**:
    *   *Padrão*: Cores originais.
    *   *Alto Contraste Claro*: Fundo branco, texto preto puro.
    *   *Alto Contraste Escuro*: Fundo preto, texto branco puro.
    *   *Amarelo em Preto*: Melhor contraste para baixa visão.
*   **Saturação**:
    *   *Normal*, *Baixa*, *Alta*, *Monocromática* (Grayscale).
*   **Filtros de Daltonismo**:
    *   *Protanopia* (Vermelho).
    *   *Deuteranopia* (Verde).
    *   *Tritanopia* (Azul).
*   **Cursor Personalizado**:
    *   *Tamanho*: Cursor ampliado.
    *   *Cores*: Padrão, Branco, Preto, Amarelo, Ciano.
*   **Lupa Inteligente**: Zoom na área sob o cursor.
*   **Ocultar Imagens**: Substitui imagens por placeholders ou as esconde.
*   **Parar Animações**: Congela GIFs e transições CSS.
*   **Destacar Links e Cabeçalhos**: Adiciona sublinhados e bordas para facilitar identificação.
*   **Brilho**: Controle de "dimmer" para reduzir a luz da tela.
*   **Modo Foco**: Escurece tudo exceto o elemento sob o cursor.

### 4. Ferramentas Motoras (Tab: Motor)
Focadas em interação física e controle.

*   **Botões Gigantes**: Aumenta significativamente as áreas clicáveis.
*   **Foco de Teclado**: Melhora o anel de foco visível para navegação via Tab.
*   **Grade de Mouse**: Divide a tela em quadrantes numerados para controle preciso do cursor.
*   **Teclado Virtual**: Teclado na tela para quem não usa teclado físico.
*   **Comando de Voz**: (Básico) Controle simples por voz.
*   **Atraso de Clique**:
    *   *Normal*, *Lento*, *Muito Lento*.
    *   Previne cliques duplos ou acidentais (tremor).
*   **Destacar Elemento**: Realça o elemento HTML sob o cursor.

### 5. Ferramentas Auditivas (Tab: Auditivo)
Focadas em audição e comunicação alternativa.

*   **VLibras**: Widget de tradução automática de Português para Libras.
*   **Leitor de Tela**: Leitura em voz alta do conteúdo focado.
*   **Legendas (Simulado)**: Ativa legendas em conteúdos de mídia.
*   **Notificações Visuais**: Pisca a tela ou exibe ícone visual quando um som é tocado.
*   **Silenciar Mídia**: Botão de pânico para cortar todo áudio do site.
*   **Descrição de Imagem**: (Placeholder) Leitura de Alt Text ou descrição via IA.

---

## 🚀 Sugestões de Melhorias Futuras (Roadmap)

Para tornar o VinculoTEA uma referência absoluta em acessibilidade, sugerimos as seguintes implementações avançadas:

### 1. Inteligência Artificial Generativa (LLMs)
*   **Descrição de Imagens em Tempo Real**: Usar APIs de visão (como GPT-4 Vision ou Gemini Pro Vision) para gerar descrições (Alt Text) ricas e contextuais para imagens que não as possuem.
*   **Simplificação de Texto (Leitura Fácil)**: Um botão "Traduzir para Linguagem Simples" que usa IA para reescrever parágrafos complexos, ideal para autistas, idosos ou pessoas com dificuldades cognitivas.
*   **Resumo Inteligente**: Gerar resumos em tópicos do conteúdo da página.

### 2. Navegação Avançada (Motor)
*   **Rastreamento Ocular (Eye Tracking)**: Implementar controle do cursor via webcam (usando bibliotecas como WebGazer.js), permitindo navegação sem mãos.
*   **Controle por Sopro ou Som**: Gatilhos sonoros específicos (estalos, assobios) para clicar ou rolar a página.
*   **Navegação por Varredura (Switch Access)**: Suporte real a dispositivos de botão único (switches), onde o foco percorre a tela e o usuário aperta o botão para selecionar.

### 3. Integração Profunda com o Sistema
*   **Persistência na Nuvem**: Salvar as preferências de acessibilidade no perfil do usuário (Supabase) para que elas sejam carregadas automaticamente em qualquer dispositivo que ele fizer login.
*   **Detecção Automática**: Sugerir perfis de acessibilidade baseados no comportamento do usuário (ex: se ele aumenta muito o zoom ou tenta clicar várias vezes sem sucesso).

### 4. Áudio e Voz
*   **Comandos de Voz Naturais**: Usar *Web Speech API* para navegação completa ("Vá para a página de perfil", "Leia o segundo parágrafo").
*   **Áudio 3D (Espacial)**: Para usuários cegos, usar som estéreo para indicar onde na tela um botão ou notificação apareceu (esquerda/direita).

### 5. Gamificação da Acessibilidade
*   **Tutorial Interativo**: Um modo de "boas-vindas" que guia o usuário na configuração do seu perfil ideal de forma lúdica, testando visão, audição e preferências motoras.

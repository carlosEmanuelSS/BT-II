# Chrome Extension with E2E Testing

Este projeto demonstra como criar uma extensão do Chrome com testes E2E usando Playwright, containerização com Docker e CI/CD com GitHub Actions.

## 🚀 Funcionalidades

- **Extensão do Chrome** com popup, content script e background script
- **Testes E2E** com Playwright carregando a extensão no Chromium
- **Containerização** com Docker e Docker Compose
- **CI/CD** com GitHub Actions
- **Build automático** da extensão em formato ZIP

## 📁 Estrutura do Projeto

```
my-chrome-extension/
├─ src/
│  ├─ popup/           # Interface do popup da extensão
│  ├─ content/         # Content script
│  └─ background/      # Background service worker
├─ icons/              # Ícones da extensão
├─ tests/              # Testes E2E com Playwright
├─ dist/               # Build da extensão (gerado automaticamente)
├─ scripts/            # Scripts de build
├─ .github/workflows/  # GitHub Actions
├─ Dockerfile
├─ docker-compose.yml
└─ package.json
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- Git

### Instalação Local

1. **Clone o repositório**
   ```bash
   git clone <seu-repositorio>
   cd my-chrome-extension
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute os testes localmente**
   ```bash
   npm test
   ```

### Execução com Docker

1. **Build da imagem**
   ```bash
   docker compose build
   ```

2. **Execute os testes E2E**
   ```bash
   docker compose run --rm e2e
   ```

3. **Execute com volume para desenvolvimento**
   ```bash
   docker compose up
   ```

## 🧪 Testes

### Testes Locais

```bash
# Build da extensão e execução dos testes
npm test

# Apenas os testes E2E
npm run test:e2e

# Build da extensão
npm run build
```

### Testes no Docker

```bash
# Execução completa
docker compose run --rm e2e

# Com relatório HTML
docker compose run --rm e2e npm run test:e2e -- --reporter=html
```

## 📦 Build da Extensão

O script `scripts/build-extension.mjs`:

1. Limpa o diretório `dist/`
2. Copia arquivos essenciais (`manifest.json`, `src/`, `icons/`)
3. Gera ícones PNG se necessário
4. Cria o arquivo ZIP da extensão

### Arquivos Gerados

- `dist/` - Diretório com a extensão pronta para carregar
- `dist/extension.zip` - Pacote ZIP da extensão

## 🔧 Configuração do Playwright

O Playwright está configurado para:

- Carregar a extensão no Chromium usando `--load-extension`
- Executar testes em modo headless
- Gerar relatórios HTML
- Capturar screenshots em caso de falha

### Configuração dos Testes

```typescript
// tests/playwright.config.ts
export default defineConfig({
  projects: [
    {
      name: 'chromium-with-extension',
      use: {
        launchOptions: {
          args: [
            `--disable-extensions-except=${distPath}`,
            `--load-extension=${distPath}`
          ]
        }
      }
    }
  ]
});
```

## 🐳 Docker

### Dockerfile

Baseado na imagem oficial do Playwright com Chromium pré-instalado:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.46.0-jammy
```

### Docker Compose

Configurado com:
- Volume para desenvolvimento
- Shared memory de 2GB para o Chromium
- Variáveis de ambiente para CI

## 🚀 CI/CD com GitHub Actions

### Workflow Automático

O workflow `.github/workflows/ci.yml` executa:

1. **Checkout** do código
2. **Setup** do Node.js 20
3. **Instalação** das dependências
4. **Build** da extensão
5. **Execução** dos testes E2E
6. **Upload** dos artefatos:
   - Relatório HTML do Playwright
   - Pacote ZIP da extensão
7. **Release** automático (apenas na branch main)

### Artefatos Gerados

- `playwright-report/` - Relatório HTML dos testes
- `extension.zip` - Pacote da extensão pronto para instalação

## 📋 Scripts Disponíveis

```json
{
  "build": "node scripts/build-extension.mjs",
  "test:e2e": "playwright test --reporter=list,html",
  "test": "npm run build && npm run test:e2e",
  "ci": "npm ci && npm run test"
}
```

## 🧪 Testes Implementados

1. **Carregamento da Extensão** - Verifica se a extensão carrega corretamente
2. **Content Script** - Testa funcionalidade do script de conteúdo
3. **Storage** - Verifica funcionalidade do chrome.storage
4. **Background Script** - Testa comunicação com o service worker

## 📊 Relatórios

### Relatório HTML do Playwright

Após a execução dos testes, acesse:

```bash
npx playwright show-report
```

### Screenshots e Vídeos

- Screenshots são capturados apenas em caso de falha
- Vídeos são mantidos apenas em caso de falha
- Arquivos são salvos em `test-results/`

## 🔍 Debugging

### Executar com Interface Gráfica

```bash
# Modo não-headless para debug
npx playwright test --headed
```

### Debug no Docker

```bash
# Com interface gráfica (requer X11)
docker compose run --rm -e DISPLAY=$DISPLAY e2e
```

## 📝 Desenvolvimento

### Estrutura da Extensão

- **Popup**: Interface do usuário (`src/popup/`)
- **Content Script**: Executa nas páginas web (`src/content/`)
- **Background**: Service worker para funcionalidades em background (`src/background/`)

### Adicionando Novos Testes

1. Crie arquivos `.spec.ts` em `tests/`
2. Use `chromium.launchPersistentContext()` para carregar a extensão
3. Teste funcionalidades específicas da extensão

## 🚀 Deploy

### Instalação Manual

1. Baixe o `extension.zip` dos artefatos do GitHub Actions
2. Extraia o arquivo
3. No Chrome: Extensões → Modo desenvolvedor → Carregar sem compactação
4. Selecione a pasta `dist/`

### Release Automático

Releases são criadas automaticamente na branch `main` com:
- Pacote ZIP da extensão
- Relatório de testes
- Tag de versão baseada no número do run

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🆘 Troubleshooting

### Problemas Comuns

1. **Chromium não carrega a extensão**
   - Verifique se o caminho `dist/` está correto
   - Confirme se o manifest.json está válido

2. **Testes falham no Docker**
   - Aumente o `shm_size` no docker-compose.yml
   - Verifique se o volume está montado corretamente

3. **Build falha**
   - Verifique se todas as dependências estão instaladas
   - Confirme se os arquivos da extensão existem

### Logs e Debug

```bash
# Logs detalhados do Playwright
DEBUG=pw:api npm test

# Logs do Docker
docker compose logs e2e
```

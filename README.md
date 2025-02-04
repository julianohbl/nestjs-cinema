# 📽️ API de Cinema PBs

## 📌 Visão Geral
Esta API fornece a lógica de back-end necessária para a criação e gerenciamento de um sistema de cinemas, incluindo cadastro de filmes e reservas de ingressos.

O foco da aplicação é garantir a qualidade e robustez das funcionalidades relacionadas aos filmes e às reservas de ingressos. Para isso, serão realizados testes automatizados abrangentes em todas as rotas do recurso `movies`, como criação, listagem, atualização e exclusão de filmes. Além disso, a rota `POST` de `tickets`, responsável pela reserva de ingressos, será testada minuciosamente para validar diferentes cenários, como sucesso na reserva, falhas por lotação esgotada e problemas de autenticação do usuário.

## 🚀 Tecnologias Utilizadas
- **Node.js** para o back-end
- **Swagger** para documentação interativa da API
- **XMind** para criação do mapa mental
- **Playwright** para testes automatizados
- **Jira** para gestão de tarefas e bugs

## 🛠️ Configuração e Execução
### 1️⃣ Clonando o Repositório
```bash
git clone https://github.com/julianohbl/nestjs-cinema.git
cd nestjs-cinema
```

### 2️⃣ Instalando Dependências
```bash
npm install
```

### 3️⃣ Configurando o Ambiente
Crie um arquivo `.env` na raiz do projeto e configure as variáveis necessárias, como a string de conexão com o banco de dados.

### 4️⃣ Iniciando a Aplicação
```bash
npm run start
```
A API estará disponível em `http://localhost:3000`

### 5️⃣ Visualizando a Documentação (Swagger)
Após iniciar a aplicação, acesse `http://localhost:3000/api/docs` para visualizar e testar os endpoints disponíveis.

---

## 🧪 Executando Testes Automatizados
### 1️⃣ Instalando o Playwright
Caso ainda não tenha instalado as dependências para o Playwright, execute:
```bash
npx playwright install
```

### 2️⃣ Rodando os Testes Automatizados
Para rodar os testes de API automatizados com Playwright:
```bash
npx playwright test
```

### 3️⃣ Gerando Relatórios de Testes
Após a execução dos testes, você pode visualizar os relatórios gerados com o seguinte comando:
```bash
npx playwright show-report
```
Isso abrirá um relatório interativo no navegador para análise detalhada.

---

## 📜 User Stories
As **User Stories** utilizadas para planejamento, análise e execução de testes estão disponíveis na pasta `UserStories` dentro deste repositório.

---

## 📩 Contribuição
Contribuições são bem-vindas! Para contribuir:
1. Crie uma branch com sua feature: `git checkout -b minha-feature`
2. Faça commit das suas alterações: `git commit -m 'Adicionando nova feature'`
3. Envie para o repositório: `git push origin minha-feature`
4. Abra um Pull Request para revisão

---

## 📄 Licença
Este projeto está sob a licença MIT. Para mais detalhes, consulte o arquivo `LICENSE`.

# FuelStock

<p align="center">
  <img height="328px" src="./FuelStock-Transparent.webp" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Version-Beta-FF9800?style=for-the-badge" alt="Version">
  
  <img src="https://img.shields.io/badge/License-BSL%201.1-blue?style=for-the-badge" alt="License">

  <img src="https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js&logoColor=white&style=for-the-badge" alt="Node.js">

  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript">

  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black&style=for-the-badge" alt="React">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white&style=for-the-badge" alt="PostgreSQL">

  <img src="https://img.shields.io/badge/Redis-8-DC382D?logo=redis&logoColor=white&style=for-the-badge" alt="Redis">

  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white&style=for-the-badge" alt="Docker">

  <img src="https://img.shields.io/badge/BullMQ-Workers-orange?style=for-the-badge" alt="BullMQ">

  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white&style=for-the-badge" alt="Prisma">
</p>


<p align="center">
  <strong>Plataforma SaaS para gerenciamento inteligente de estoque de lojas de conveniência de postos de combustível.</strong>
</p>

<p align="center">
  📦 Controle de Estoque • 📊 Analytics • 🤖 IA • 🏪 Multi-Tenant • ⚡ Automação
</p>

---

## 📖 Sobre

O **FuelStock** é um SaaS B2B desenvolvido para transformar o gerenciamento de estoque em lojas de conveniência de postos de combustível.

Enquanto muitos sistemas legados utilizados pelo setor concentram-se na operação das bombas de combustível e oferecem pouca ou nenhuma integração com o estoque da loja de conveniência, o FuelStock foi desenvolvido para integrar-se diretamente a esses sistemas, como o Fueltech, utilizando os dados já existentes para centralizar exclusivamente as informações relacionadas ao estoque da loja. Dessa forma, os gestores podem acompanhar a movimentação dos produtos em tempo real e tomar decisões com base em dados atualizados.

Além do gerenciamento de estoque, o sistema fornece métricas estratégicas sobre vendas, compras, lucratividade e desempenho operacional. Com integração de Inteligência Artificial, a plataforma auxilia na tomada de decisões, identificação de oportunidades e prevenção de perdas, reduzindo desperdícios e aumentando a eficiência operacional.

---

## 📸 Screenshots

### Dashboard

<p align="center">
  <img src="./docs/Analytics.png" width=900>  
</p>

### Gestão de estoque

<p align="center">
  <img src="./docs/MainPanel.png" width=900>  
  <img src="./docs/Edit.png" width=900>
</p>

### Inteligência Artificial

<p align="center">
  <img src="./docs/AI.png" width=900>  
  <img src="./docs/AIAnalysis.png" width=900>  
</p>

### Geral

<p align="center">
  <img src="./docs/FullTop.png" width=49%>  
  <img src="./docs/FullBottom.png" width=49%>  
</p>

---

## ✨ Principais Recursos

* 📦 Gerenciamento inteligente de estoque
* 📈 Dashboard com indicadores estratégicos
* 🤖 Insights gerados por Inteligência Artificial
* 📊 Controle de vendas, compras e lucratividade
* 🏪 Arquitetura Multi-Tenant
* 📱 Interface totalmente responsiva
* 🔐 Autenticação segura com JWT + Refresh Tokens
* 📁 Importação automatizada de relatórios
* 📦 Histórico completo de movimentações
* 📉 Análise de desempenho operacional
* ⚡ Processamento assíncrono através de Workers

---

## ❗ O Problema

Postos de combustível movimentam um alto fluxo de caixa diariamente, não apenas através do abastecimento, mas também por meio das lojas de conveniência. Apesar disso, grande parte dos sistemas utilizados nesse setor ainda apresenta limitações críticas no controle dessas operações.

Na prática, muitas lojas trabalham sem um gerenciamento de estoque realmente integrado, dificultando o acompanhamento de produtos, reposições, margens de lucro e desempenho das vendas. Como consequência, gerentes e proprietários acabam gastando tempo excessivo em processos manuais, tomando decisões sem dados concretos e sofrendo perdas silenciosas causadas por rupturas, desperdícios e baixa previsibilidade.

---

## 💡 A Solução

O **FuelStock** centraliza todas as informações operacionais da loja em uma única plataforma, oferecendo um ambiente moderno para controle de estoque, análise de desempenho e tomada de decisão.

A plataforma fornece visibilidade completa sobre entradas e saídas de produtos, vendas, compras, movimentações de estoque e indicadores estratégicos, permitindo que gestores acompanhem toda a operação em tempo real.

Além do controle operacional, o FuelStock transforma dados em inteligência através de análises avançadas e recursos de Inteligência Artificial, auxiliando na identificação de produtos mais lucrativos, oportunidades de reposição, padrões de consumo e possíveis perdas financeiras.

Mais do que um sistema de estoque, o FuelStock atua como uma ferramenta estratégica para crescimento, oferecendo maior previsibilidade, controle e eficiência operacional.

---

## 🏗️ Arquitetura

Este repositório contém apenas o **Core** da plataforma.

A arquitetura completa do FuelStock é composta por diversos serviços independentes, incluindo:

* API Principal
* Workers de processamento
* Dashboard Web
* Serviços de Inteligência Artificial
* Banco de Dados
* Cache distribuído
* Infraestrutura de autenticação

Alguns componentes proprietários e serviços internos não fazem parte deste repositório público.

---

## 🛠️ Stack

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma ORM

### Banco de Dados
- PostgreSQL
- Redis

### Filas e Processamento
- BullMQ

### Frontend
- React
- Vite
- Tailwind CSS
- Zustand
- Recharts

### Segurança
- JWT
- Argon2
- Zod

### DevOps
- Docker
- Nginx
- GitHub Actions

---

## 🚀 Executando o Projeto

> **Atenção**
>
> Este repositório contém apenas o núcleo da plataforma. Algumas funcionalidades dependem de componentes privados que não estão distribuídos publicamente.

Clone o repositório:

```bash
git clone https://github.com/tulin404/FuelStock-Core.git

cd FuelStock
```

Configure as variáveis de ambiente:

```bash
cd Server/backend && touch .env.dev
```

Suba os containers:

```bash
docker compose -f docker-compose.dev.yml up -d
```

Aplique as migrations:

```bash
pnpm prisma migrate dev
```

> **Produção**
>
> O ambiente de produção é provisionado e atualizado automaticamente pelo pipeline de CI/CD, incluindo a execução das migrations e o gerenciamento dos containers.

---

## 📚 Documentação

A documentação oficial será disponibilizada futuramente.

Ela incluirá:

* Arquitetura completa
* Fluxo de autenticação
* API REST
* Banco de dados
* Workers
* Deploy
* Integrações

---

## ⚠️ Nota

Este repositório **não representa a plataforma completa**.

Alguns serviços internos, integrações e componentes proprietários foram removidos ou não são distribuídos publicamente.

O objetivo deste repositório é demonstrar a arquitetura, a qualidade do código e parte das funcionalidades desenvolvidas para o FuelStock.

---

## 📄 Licença

Este projeto é distribuído sob a **Business Source License 1.1 (BSL 1.1)**.

Consulte o arquivo **LICENSE** para mais informações.

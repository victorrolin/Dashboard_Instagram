# EliteDash 📊 - Inteligência de Leads para Instagram

O EliteDash é um dashboard premium de alta performance, desenvolvido para gestão e qualificação de leads do Instagram em tempo real. Construído com foco total em escalabilidade, integra orquestração de dados complexa com uma interface de usuário glassmorphic de última geração.

![Vibe Coding Powered](https://img.shields.io/badge/Metodologia-Vibe%20Coding-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Docker Swarm](https://img.shields.io/badge/Docker%20Swarm-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-FF6C37?style=for-the-badge&logo=n8n&logoColor=white)

---

## 🚀 Recursos Principais

- **Fluxos de Dados em Tempo Real**: Sincronização instantânea de interações de leads usando Supabase Realtime.
- **Scoring de Leads Avançado**: Algoritmos automatizados via IA para qualificar e categorizar leads.
- **Interface Glassmorphic Premium**: Experiência visual de alto nível com modo escuro, animações e métricas responsivas.
- **Autenticação Segura**: Gerenciamento robusto de sessões e rotas protegidas via Supabase Auth.
- **Infraestrutura Enterprise**: Arquitetura otimizada para clusters de alta disponibilidade operando com Docker Swarm e Traefik.

---

## 🏗️ Arquitetura Técnica

O projeto segue a filosofia **Elite Swarm Stack**:

```mermaid
graph TD
    A[Instagram API / Webhooks] --> B(n8n Orchestration)
    B --> C{Supabase DB & Auth}
    C --> D[React + Vite Dashboard]
    D --> E((User Interface))
    
    subgraph Infraestrutura (Docker Swarm)
    F[Traefik Reverse Proxy]
    G[Dashboard Service]
    H[n8n Service]
    I[Evolution API]
    end
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Vanilla CSS (glassmorphism) |
| **Backend / BaaS** | Supabase (PostgreSQL, Realtime, Auth, Edge Functions) |
| **Automação** | n8n (Queue Mode), Webhooks, Evolution API |
| **DevOps / Infra** | Docker Swarm, Traefik, Portainer, Nginx |

---

## ⚡ Metodologia: Vibe Coding

Este projeto foi construído utilizando o **Vibe Coding** — uma metodologia de orquestração de software de próxima geração onde agentes de IA (como o Antigravity) atuam como o principal braço de execução.

- **Governança Arquitetural**: O desenvolvedor atua como o arquiteto, definindo a lógica de alto nível e as restrições.
- **Iteração Rápida**: O desenvolvimento orientado por IA permite a construção de módulos complexos e prontos para produção em tempo recorde.
- **Garantia de Qualidade**: Ciclos automatizados de verificação e feedback em tempo real via terminal.

---

## 📦 Implantação (Docker Swarm)

Para implantar este serviço em um stack Swarm estilo **Orion**:

1. **Construir a imagem**:
   ```bash
   docker build -t elitedash-elite:latest .
   ```

2. **Implantar no Stack**:
   ```bash
   docker stack deploy -c docker-compose.yml dashinstagram
   ```

3. **Monitorar via Portainer**: Certifique-se de que as labels do Traefik estão mapeadas corretamente para SSL e roteamento.

---

## 🤝 Contato

**Victor Hugo Rolin da Silva**  
Arquiteto de Software AI & Especialista em Infraestrutura  
[LinkedIn](https://www.linkedin.com/in/victor-silva-58032b131) | [GitHub](https://github.com/victorrolin)

---
> *"Construir mais, construir rápido. Orquestrando a próxima geração de softwares com IA."*

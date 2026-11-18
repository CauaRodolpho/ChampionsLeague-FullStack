
# UCL Scouting & Data Hub

Sistema full-stack de gestão, análise técnica e comparação de atletas e clubes da UEFA Champions League. Desenvolvido com arquitetura em camadas (N-Layers) no back-end em Node.js/TypeScript e interface analítica em React + Tailwind CSS.

## Funcionalidades

- **Gestão de Elencos e Clubes (CRUD Completo):** Cadastro, listagem, edição completa com janela de transferências (`PUT`), ajuste granular de estatísticas (`PATCH`) e exclusão com confirmação.
- **Comparador Head-to-Head (1v1):** Seleção de dois atletas para duelo direto atributo por atributo (`PAC`, `SHO`, `PAS`, `DRI`, `DEF`, `PHY` e `Overall`) com cálculo automático de vantagem numérica.
- **Enriquecimento Automático de Mídia:** Integração no back-end com a API da TheSportsDB para busca e persistência local de escudos dos clubes e fotos dos atletas, com fallback inteligente na interface.
- **Filtros e Ordenação em Tempo Real:** Filtragem combinada por clube, posição, busca textual por nome ou nacionalidade e ordenação dinâmica por rating.
- **Persistência em JSON:** Leitura e gravação assíncrona em arquivos locais (`players.json` e `clubs.json`), mantendo todas as alterações entre reinicializações do servidor.

## Arquitetura e Tecnologias

### Back-end (`/backend`)
- **Runtime & Framework:** Node.js, Express, TypeScript
- **Padrão Arquitetural:** N-Layers (`Routes` → `Controllers` → `Services` → `Repositories` → `Models`)
- **Armazenamento:** Persistência baseada em sistema de arquivos (`fs/promises`)

### Front-end (`/frontend`)
- **Core:** React, TypeScript, Vite
- **Estilização & Ícones:** Tailwind CSS, Lucide React
- **Organização:** Custom Hooks (`useChampionsData`), componentes desacoplados e tipagem estrita

## Estrutura de Pastas

```text
Champions-League/
├── backend/
│   └── src/
│       ├── controllers/      # Recepção de requisições e respostas HTTP
│       ├── services/         # Regras de negócio e integração com TheSportsDB
│       ├── repositories/     # Leitura e escrita nos arquivos JSON
│       ├── models/           # Contratos e interfaces TypeScript
│       ├── data/             # Base de dados persistente (players.json / clubs.json)
│       ├── routes.ts         # Definição dos endpoints REST
│       └── server.ts         # Inicialização do servidor Express
└── frontend/
    └── src/
        ├── components/       # Header, PlayerCard, PlayerModal, CompareModal
        ├── hooks/            # useChampionsData (estado e sincronização com a API)
        ├── pages/            # ClubsPage
        ├── services/         # Cliente HTTP (api.ts)
        └── types/            # Tipagens do domínio
Endpoints da APIMétodoRotaDescriçãoGET/api/playersLista todos os jogadores e sincroniza fotos pendentesGET/api/players/:idRetorna os dados de um jogador específicoPOST/api/playersCadastra um novo atletaPUT/api/players/:idAtualiza dados cadastrais, clube (transferência) e atributosPATCH/api/players/:idAtualiza apenas as estatísticas do atletaDELETE/api/players/:idRemove um atleta da baseGET/api/clubsLista todos os clubes cadastradosPOST/api/clubsCadastra um novo clube buscando o escudo automaticamenteDELETE/api/clubs/:idRemove um clube da baseComo Executar o ProjetoPré-requisitosNode.js (v18 ou superior)npm1. Clonar o repositórioBashgit clone [https://github.com/CauaRodolpho/Champions-League.git](https://github.com/CauaRodolpho/Champions-League.git)
cd Champions-League
2. Iniciar o Back-endBashcd backend
npm install
npm run start:dev
O servidor iniciará em http://localhost:3333.3. Iniciar o Front-endEm um novo terminal:Bashcd frontend
npm install
npm run dev
A aplicação estará disponível em http://localhost:5173.AutorDesenvolvido por Cauã Rodolpho — GitHub

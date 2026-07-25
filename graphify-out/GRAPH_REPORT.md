# Graph Report - beerloga-site  (2026-07-26)

## Corpus Check
- 46 files · ~54,315 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 253 nodes · 318 edges · 23 communities (17 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- page.tsx
- devDependencies
- CatalogClient.tsx
- compilerOptions
- Design System Master File
- package.json
- БИРЛОГА
- layout.tsx
- dependencies
- include
- chatgpt-auth.ts
- route.ts
- page.tsx
- index.ts
- rendered-html.test.mjs
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- site.spec.ts
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `БИРЛОГА` - 12 edges
3. `createMetadata()` - 10 edges
4. `scripts` - 8 edges
5. `PageIntro()` - 8 edges
6. `CatalogClient()` - 7 edges
7. `include` - 7 edges
8. `Design System Master File` - 7 edges
9. `stores` - 5 edges
10. `Global Rules` - 5 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts
- `POST()` --calls--> `getDb()`  [EXTRACTED]
  examples/d1/app/api/notes/route.ts → db/index.ts

## Import Cycles
- None detected.

## Communities (23 total, 6 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.09
Nodes (17): metadata, metadata, metadata, metadata, metadata, metadata, metadata, routes (+9 more)

### Community 1 - "devDependencies"
Cohesion: 0.06
Nodes (35): @cloudflare/vite-plugin, drizzle-kit, eslint, eslint-config-next, devDependencies, @cloudflare/vite-plugin, drizzle-kit, eslint (+27 more)

### Community 2 - "CatalogClient.tsx"
Cohesion: 0.16
Nodes (14): metadata, structuredData, CatalogClient(), CatalogClientProps, initialParam(), normalize(), categoryLabels, ProductGrid() (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.10
Nodes (21): ./*, dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental (+13 more)

### Community 4 - "Design System Master File"
Cohesion: 0.11
Nodes (17): Additional Forbidden Patterns, Anti-Patterns (Do NOT Use), Buttons, Cards, Color Palette, Component Specs, Design System Master File, Global Rules (+9 more)

### Community 5 - "package.json"
Cohesion: 0.11
Nodes (17): engines, node, name, overrides, postcss, sharp, private, scripts (+9 more)

### Community 6 - "БИРЛОГА"
Cohesion: 0.12
Nodes (15): SEO и доступность, БИРЛОГА, Данные, Демонстрационные данные, Изображения, Маршруты, Ограничения, Перед публикацией (+7 more)

### Community 7 - "layout.tsx"
Cohesion: 0.21
Nodes (9): manrope, metadata, ptSerif, viewport, Logo(), Footer(), Header(), MobileActionBar() (+1 more)

### Community 8 - "dependencies"
Cohesion: 0.18
Nodes (11): drizzle-orm, lucide-react, next, dependencies, drizzle-orm, lucide-react, next, react (+3 more)

### Community 9 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 10 - "chatgpt-auth.ts"
Cohesion: 0.39
Nodes (8): chatGPTSignInPath(), chatGPTSignOutPath(), ChatGPTUser, getChatGPTUser(), isReservedAuthPath(), requireChatGPTUser(), safeDecodeURIComponent(), safeRelativeReturnPath()

### Community 11 - "route.ts"
Cohesion: 0.39
Nodes (5): getDb(), GET(), POST(), toRouteErrorMessage(), notes

### Community 12 - "page.tsx"
Cohesion: 0.33
Nodes (3): metadata, BeerAdvertisingSection(), beerProducts

### Community 13 - "index.ts"
Cohesion: 0.29
Nodes (3): Env, ExecutionContext, worker

## Knowledge Gaps
- **114 isolated node(s):** `metadata`, `metadata`, `metadata`, `metadata`, `metadata` (+109 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `metadata`, `metadata`, `metadata` to the rest of the system?**
  _116 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09041835357624832 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Design System Master File` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
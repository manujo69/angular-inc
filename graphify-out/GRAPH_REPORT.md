# Graph Report - angular-inc  (2026-05-11)

## Corpus Check
- 27 files · ~19,033 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 173 nodes · 243 edges · 14 communities (12 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2db628da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `UserApiService` - 10 edges
2. `User` - 8 edges
3. `MockUserApiService` - 7 edges
4. `AngularInc` - 7 edges
5. `getNthColumn()` - 5 edges
6. `enableUI()` - 5 edges
7. `g()` - 5 edges
8. `getNthColumn()` - 5 edges
9. `enableUI()` - 5 edges
10. `g()` - 5 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities (14 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.1
Nodes (17): badge, btn, card, deleteSpy, event, mockUser, roleBadge, selectSpy (+9 more)

### Community 1 - "Community 1"
Cohesion: 0.14
Nodes (7): App, appConfig, routes, el, fixture, environment, MockUserApiService

### Community 2 - "Community 2"
Cohesion: 0.12
Nodes (14): cmp, DataTableComponent, key, cells, columns, data, el, emitted (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (12): Angular Rules, Bootstrap 5 / SCSS, code:block1 (src/app/), code:ts (...(environment.useMock ? [{ provide: UserApiService, useCla), Commands, File Naming, Git, Hard Rules (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 6 - "Community 6"
Cohesion: 0.14
Nodes (13): Additional Resources, AngularInc, Building, Code scaffolding, code:bash (ng serve), code:bash (ng generate component component-name), code:bash (ng generate --help), code:bash (ng build) (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (9): alert, badge, card, cards, empty, grid, mockUsers, spinner (+1 more)

### Community 8 - "Community 8"
Cohesion: 0.35
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 9 - "Community 9"
Cohesion: 0.35
Nodes (8): a(), B(), D(), g(), i(), k(), Q(), y()

### Community 10 - "Community 10"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 11 - "Community 11"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

## Knowledge Gaps
- **53 isolated node(s):** `fixture`, `el`, `key`, `cmp`, `columns` (+48 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Community 0` to `Community 7`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `UserApiService` connect `Community 0` to `Community 1`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `MockUserApiService` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `fixture`, `el`, `key` to the rest of the system?**
  _53 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
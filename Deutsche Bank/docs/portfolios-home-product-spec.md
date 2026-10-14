# Portfolios Home — Product Specification (Prototype)

**Audience:** Product, design, and engineering reviewing the Deutsche Bank Wealth Management “Home — consolidated view” prototype  
**Status:** Interactive prototype with representative mock data (not production APIs)

---

## 1. Product intent

### 1.1 Problem

Affluent clients often hold wealth across many portfolios (advisory, execution, retirement, trust structures, etc.). They need a **single home** that answers, at a glance:

- How much am I worth in total, and how did I move today and year-to-date?
- Which portfolios matter most, and how are they performing?
- What do I own **across** portfolios when the same security appears in more than one mandate?

### 1.2 Solution framing

This prototype models **“Home”** as a **consolidated wealth cockpit**: persistent navigation on the left, a white main workspace on the right, and a **tabbed** content model so the user can switch between portfolio-level and holding-level lenses without leaving the page.

### 1.3 Design principles embodied in the build

| Principle | How it shows up |
|-----------|-----------------|
| **Consolidation first** | Greeting and summary band reflect **all** portfolios; Holdings tab deduplicates by security with “held in” context. |
| **Progressive disclosure** | Summary band = headline KPIs; tables = drillable lists; holding modal = position-level detail without a full page navigation. |
| **Power without clutter** | Filtering uses a **formula bar + quick menu + full panel** pattern (inspired by modern issue trackers), not a wall of always-visible facet controls. |
| **Parity across tabs** | Holdings reuses the same filter UX vocabulary as Portfolios (search, `f` shortcut, chips, facet counts). |
| **Honest scope** | Several top-level tabs are **placeholders**; only Portfolios (list/chart) and Holdings are fully implemented. |

### 1.4 Persona and assumptions

- **Primary user:** Private client “Nick Thomas” (sample name in copy and footer).
- **Currency display:** All values labeled **USD ($)** in the main header; underlying rows may carry portfolio currency metadata for filtering.
- **Data:** Static/demo datasets; counts, sparklines, and chart series are illustrative.

---

## 2. Information architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  App shell (full viewport, cool gray page background)           │
│  ┌──────────────┬──────────────────────────────────────────────┐│
│  │ Sidebar      │ Main panel (white)                           ││
│  │ 211px        │  • Greeting + tab bar + USD disclaimer       ││
│  │              │  • Portfolio Summary band (always visible)   ││
│  │              │  • Tab-specific toolbar                      ││
│  │              │  • Scrollable content (table or chart)       ││
│  └──────────────┴──────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

**Top-level tabs (main panel):**

1. **Portfolios** — list + chart.
2. **CIO Insights** — placeholder.
3. **Watchlist** — placeholder.
4. **Holdings** — list table.
5. **Liabilities** — placeholder.
6. **Transactions** — placeholder.

Switching tabs **preserves vertical scroll position** of the main content area when returning (scroll is restored after layout).

---

## 3. Sidebar — product, UI, and UX

### 3.1 Role in the product

The sidebar is the **global wayfinding and portfolio awareness** strip. It is not scoped to the active tab: portfolio names remain visible while the user works in Holdings or (eventually) other tabs.

### 3.2 Structure (top to bottom)

1. **Brand header (~46px)**  
   European Wealth Management lockup and a **collapse** control (visual only in prototype; collapse behavior not fully wired).

2. **Primary navigation**  
   Home (active state), Markets, News, Reports, Transactions, Notifications (badge **17+**), Messages (badge **4 new**).  
   **UX:** Active Home uses a subtle gray fill (`#eef2f5`), not a separate “app within app.” Secondary destinations are tappable but do not load real content in this prototype.

3. **“Your portfolios” list**  
   Scrollable list of non-total portfolios from the same dataset as the Portfolios table. Each row shows:
   - Folder icon + Portfolio name  

   **Product thinking:** Gives at-a-glance health of each mandate without opening the table. Sparklines reinforce “movement” alongside the numeric day change.

4. **Quick Actions**  
   Three outlined actions: **New portfolio**, **Standing order**, **Payment**.  
   - **New portfolio** opens the **Create portfolio** modal (see §7.1).  
   - Other actions are visual stubs.

5. **User footer**  
   Avatar initials **NT**, name **Nick Thomas**, account menu chevron. Anchors the session to a identifiable client profile.

### 3.3 Responsive behavior

- **Desktop (lg+):** Fixed **211px** column, full height, right border.  
- **Mobile / tablet:** Sidebar hidden; **hamburger** in a compact main header opens a **drawer** (overlay + slide-in panel). Tap outside or close flow dismisses drawer.

### 3.4 Visual language

- Background `#f9fbfd`, hairline dividers `#dfe3e9`, body text `#3c4556`, active/nav emphasis `#07132a` / DB blue `#00205b`.  
- Typography ~12px for nav and portfolio names; badges at 10px.

---

## 4. Shared main panel (above tab content)

### 4.1 Greeting

Time-aware salutation: “Good morning / afternoon / evening Nick,” plus copy that states a **consolidated view across N portfolios** (N = count of data rows, excluding total).

**UX intent:** Reinforces that the page is **aggregate**, not a single portfolio detail page.

### 4.2 Tab bar

Segmented control in a soft gray track; active tab = white cell with hairline border. Horizontally scrollable on small widths.

**Accessibility:** `tablist` / `tab` roles, `aria-selected` on active tab.

### 4.3 USD disclaimer

“All values are in USD ($)” with info icon — sets expectation for summary, tables, and modal figures.

### 4.4 Portfolio Summary band

**Content columns (conceptually):**

- **Total market value** with as-of date, large figure, **day change** (amount + %).  
- **Returns / risk context** (e.g. YTD return, benchmark comparison spread — tied to default wealth benchmark policy in demo data).  
- Additional hero metrics as defined in summary data (performance framing for the consolidated book).

**Visual:** Light `#fafbfd` band, ~132px min height, horizontal scroll on narrow viewports.

---

## 5. Portfolios tab

### 5.1 Jobs to be done

- Scan all portfolios by value, day gain, and total gain.  
- Narrow the list by mandate type, risk, currency, size, and performance.  
- Optionally switch to **chart view** for indexed performance vs benchmark.  
- Start **new portfolio** onboarding from sidebar or future entry points.

### 5.2 View modes

| Mode | Toolbar | Content |
|------|---------|---------|
| **List view** | Search + Filter by + formula bar + List/Chart toggle | Sortable-style **grid table** with optional column-header filters |
| **Chart view** | List/Chart toggle only (search/filter hidden) | **Indexed performance chart** — range, portfolio selector, benchmark selector |

Switching to chart view **scrolls content to top**. List view restores filter strip.

### 5.3 List toolbar

- **Search:** “Search portfolios” — filters by **portfolio name** (case-insensitive substring). Independent of facet filters but combined with AND logic in the result set.  
- **Filter by:** Opens **quick filter menu**; badge shows **active filter count** (facet tokens + search if non-empty).  
- **Formula bar:** Read-only-style display of active constraints as **Property is [chip] [chip]…** clauses. Each chip removable; search appears as its own removable token when present.

### 5.4 Filter model (Portfolios)

**Combination logic:**

- **Across categories:** AND (must satisfy every category that has selections).  
- **Within a category:** OR (any selected option in that category matches).  
- **Search:** AND with facet filters.  
- **Total row:** Shown only when **no facet filters** are active (search alone may still show total row per data rules — total row excluded from search matching).

**Categories and options:**

| Category | Options (prototype) |
|----------|---------------------|
| Type | Advisory, Execution, Retirement, Other |
| Risk | Conservative, Moderate, Aggressive, Speculative |
| Currency | USD, EUR, GBP, CHF |
| Value (amount) | Over $1M, Over $5M, Over $10M (custom threshold in side panel / column menus where enabled) |
| Day gain | Gainers today, Losers today, Flat (±0.05%), Up > +1%, Down < −1%, Custom % range |
| Total gain | Positive total gain, Negative total gain |

**Facet counts (quick menu & side panel):**  
Counts are computed on rows that match **current draft filters** and **current search**, but **exclude** the category being counted — standard faceted search behavior so counts reflect “how many if I add this option.”

**Preview:** Side panel can show **how many portfolios** would match before apply.

### 5.5 Quick filter menu

- Anchored under **Filter by**; repositions on resize / formula bar height changes.  
- Type-to-filter list of all quick options with **counts**; toggling applies **immediately** (live filter).  
- Link/action to open **full filter panel** for day-movement custom range and exhaustive toggling.  
- Keyboard: **`f`** opens quick menu when focus is not in an input (list view only).

### 5.6 Full filter side panel

- Slide-over (~360px) with grouped checkboxes, counts, custom min/max for day movement when “Custom range” selected.  
- **Apply** commits draft; **Clear** resets to empty filters.  
- Closes on overlay / explicit close.

### 5.7 Column-header filters (table)

When portfolio count **> 10**, Value, Day gain, and Total gain headers expose **filter affordances** (same option sets as amount / day movement / total gain categories). Menus anchor to headers; duplicate path for power users who think in spreadsheet terms.

When **≤ 10** portfolios, column filters are **disabled** to reduce noise for small books.

### 5.8 Portfolios table UX

- Grid with horizontal scroll on narrow viewports; sticky header support.  
- **Empty state:** “No portfolios match these filters” + **Clear filters** (clears facets **and** search).  
- **Screen reader hint:** Swipe/scroll for columns; header filters on key numeric columns when enabled.

### 5.9 Chart view (Portfolios)

- **Indexed performance chart:** Rebases series to 100 at range start.  
- Controls: time **range** (e.g. YTD), **portfolio** selector (including “all”), **benchmark** selector from demo benchmark catalog.  
- Copy explains comparison purpose.  
- Toggle back to list view via segmented control (duplicated in chart header when in fill-height layout).

---

## 6. Holdings tab

### 6.1 Jobs to be done

- See **consolidated positions** (one row per security in the demo set).  
- Understand **where** each holding lives (held-in tags spanning portfolios).  
- Filter by sleeve, asset class, size, concentration (% of wealth), and YTD performance.  
- **Export** the current filtered list.  
- Open **holding detail** for consolidated G/L and per-portfolio slices.

### 6.2 Toolbar

- **Search holdings** — substring match on **security name**.  
- **Filter** — same interaction pattern as Portfolios (quick menu + side panel + formula bar). Badge = active count.  
- **Export list** — downloads **CSV** of **currently visible** data rows (excludes total row), columns: Security, Held in, Value (USD), % of wealth, YTD %.

**Keyboard:** **`f`** opens holdings quick filter menu (when not typing in a field).

### 6.3 Filter model (Holdings)

**Combination logic:** Same AND across categories, OR within category, AND with search.

| Category | Options (prototype) |
|----------|---------------------|
| Held in | Advisory, Trust, Private markets, Execution US, Execution EU, Retirement, Multiple portfolios |
| Asset class | Equity, Fixed income, Cash & equivalents, Alternatives, Funds |
| Value | Over $500K, Over $1M, Over $2M |
| % of wealth | Over 5%, Over 10% |
| YTD | YTD gainers, YTD losers, Above 10%, Below −10% |
| Sort | Value high→low (default), value low→high, % wealth high→low, YTD best/worst, Security A–Z |

**Sort** appears in formula bar as a clause when not default (`Value high to low`). Changing sort affects row order **after** filtering.

**Total row behavior:**

- **No active filters/search/non-default sort:** Show full dataset + canonical **Total** row at bottom.  
- **Any filter/search/sort active:** Show filtered rows + a **computed subtotal** row (Total label, summed value; wealth/YTD not aggregated meaningfully in subtotal row).  
- **Zero matches:** Empty table state with clear filters.

**Held-in matching:** A row’s “held in” field is parsed into tags; filter matches if **any** selected tag appears on the row (OR within Held in category).

### 6.4 Holdings table UX

- Columns: Security, Held in, Value, % of wealth, YTD %.  
- **Row click** (data rows only) opens **Holding detail modal**. Total/subtotal rows do not open detail.  
- Horizontal scroll + sticky header pattern aligned with Portfolios table rhythm.  
- Empty state with **Clear filters** (facets + search).

---

## 7. Modals and overlays

### 7.1 Create portfolio

**Trigger:** Sidebar → Quick Actions → **New portfolio**.

**Content:** Title “New portfolio”; body explains full onboarding (type, currency, mandate) is **out of scope** — placeholder copy.  
**Actions:** Cancel (dismiss), Continue (dismiss — no next step wired).  
**Dismiss:** Overlay click, Escape key.

**Product intent:** Reserves space for a multi-step onboarding flow without blocking the rest of the prototype.

### 7.2 Holding detail

**Trigger:** Click a holdings table row.

**Purpose:** Answer “what is this position worth to me in total, and how is it split across portfolios?” without navigating away from Home.

**Header:**

- Security name, ticker, ISIN (when present), sector · asset class.  
- For non-cash: last price + day change ($ and %).

**Hero block — Unrealised gain/loss (consolidated):**

- Large signed $ and %; market value, cost basis, quantity, table YTD for cross-check.

**Held across portfolios:**

- Table: Portfolio name, Value, % of portfolio.  
- Footnote: **% of total wealth** and whether position is **above or within** single-name guideline threshold (demo rule per holding).

**Guidance copy:**

- Multiple portfolios: tax lots / trading apply **per portfolio**, not consolidated.  
- Single portfolio: directs user to open portfolio for lots, history, actions.

**Footer actions:**

- **Close**  
- **Message advisor** (shown when **above** guideline — stub)  
- **View in portfolio** (primary — closes modal in prototype)

**Dismiss:** Overlay, Close, Escape.

**Product rationale (modal vs full page):** Holdings tab is already a **wide scan**; modal supports **spot check** on one name and returns to filter context. Full page remains appropriate for trading and tax-lot workflows (called out in copy).

### 7.3 Filter UI overlays

- **Quick menu:** Popover; click outside closes.  
- **Side panel:** Modal sheet from the right with backdrop.

---

## 8. Cross-cutting UX

### 8.1 Active filter affordances

- Numeric badge on Filter / Filter by button.  
- Formula bar chips — per-token removal.  
- Clear filters on empty table states.

### 8.2 Motion

- Holdings table rows may use light motion on interaction (Framer Motion) for polish; not a functional requirement.

### 8.2 Accessibility notes (prototype level)

- Dialog roles and labelled titles on modals.  
- Escape closes modals.  
- Segmented controls expose `radio` / `aria-checked` where implemented.  
- Some sidebar destinations and chart controls are visual-only.

### 8.3 Out of scope (explicit)

- Real authentication, entitlements, and advisor vs client views.  
- CIO Insights, Watchlist, Liabilities, Transactions tab content.  
- Standing order / Payment quick actions.  
- Sidebar collapse persistence, Markets/News deep links.  
- Live market data, FX conversion for non-USD portfolios in the summary band.  
- Create portfolio multi-step flow beyond placeholder dialog.

---

## 9. Success metrics (if this were production)

Suggested north-star and guardrails:

| Metric | Rationale |
|--------|-----------|
| Time to answer “total wealth + day change” | Summary band + greeting should answer in <3 seconds. |
| Filter task completion rate | Users can refine Portfolios/Holdings lists without training (formula bar discoverability). |
| Holdings modal engagement vs bounce | Modal should reduce unnecessary navigation to portfolio detail for simple questions. |
| Export usage on Holdings | Validates consolidated reporting need. |

---

## 10. Prototype summary (one paragraph)

**Portfolios Home** is a wealth-management **consolidated dashboard prototype**: a persistent **sidebar** for global nav, portfolio health, and quick actions; a **main workspace** with time-aware greeting, **Portfolio Summary** KPIs, and six top-level **tabs** (two fully built). The **Portfolios** tab combines spreadsheet-like **filtering** (search, formula bar, quick menu, side panel, optional column filters) with a **list/chart** toggle for indexed benchmark comparison. The **Holdings** tab mirrors that filter UX for consolidated positions, adds **CSV export**, and uses a **holding detail modal** for consolidated unrealised G/L and per-portfolio allocation, with explicit copy on limits of consolidated actions. Remaining tabs and several CTAs are **intentional placeholders** so stakeholders can judge layout, density, and interaction patterns before backend integration.

---

*Document generated from prototype behavior as implemented for `/prototype/portfolios-home`. Update this spec when Figma or production requirements change.*

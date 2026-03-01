# Database Schema Reference

Detailed schema for the buyer mandate marketplace. Adapt field types to your ORM/database (Prisma, Drizzle, Knex, raw SQL, etc.).

## Core Tables

### `users`

Extend your existing users table or create one:

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),          -- NULL if using magic link only
  name          VARCHAR(255),
  role          VARCHAR(20) NOT NULL DEFAULT 'buyer',
                -- 'buyer', 'agency_owner', 'admin'
  agency_id     UUID REFERENCES agencies(id),  -- set when agency owner claims
  email_verified BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);
```

### `mandates`

```sql
CREATE TABLE mandates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  ev_min          INTEGER,               -- in thousands (e.g. 3000 = £3m)
  ev_max          INTEGER,               -- in thousands
  ev_currency     VARCHAR(3) DEFAULT 'GBP',
  headcount_min   INTEGER,
  headcount_max   INTEGER,
  buyer_type      VARCHAR(50),           -- PE-backed, Independent, Strategic, etc.
  deal_structure  TEXT[],                 -- array of preferences
  timeline        VARCHAR(50),           -- Active now, Next 3 months, etc.
  revenue_model   TEXT[],                -- Retainer, Project, Performance, etc.
  notes           TEXT,
  status          VARCHAR(20) DEFAULT 'active',
                  -- 'active', 'paused', 'archived'
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### `mandate_geographies`

```sql
CREATE TABLE mandate_geographies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id  UUID NOT NULL REFERENCES mandates(id) ON DELETE CASCADE,
  geography   VARCHAR(50) NOT NULL
              -- UK, US, EU, APAC, MENA, LATAM, Global
);

CREATE INDEX idx_mandate_geo ON mandate_geographies(mandate_id);
CREATE INDEX idx_geo_lookup ON mandate_geographies(geography);
```

### `mandate_services`

```sql
CREATE TABLE mandate_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id  UUID NOT NULL REFERENCES mandates(id) ON DELETE CASCADE,
  service     VARCHAR(100) NOT NULL
              -- from standardised services taxonomy
);

CREATE INDEX idx_mandate_svc ON mandate_services(mandate_id);
CREATE INDEX idx_svc_lookup ON mandate_services(service);
```

### `mandate_sectors`

```sql
CREATE TABLE mandate_sectors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id  UUID NOT NULL REFERENCES mandates(id) ON DELETE CASCADE,
  sector      VARCHAR(100) NOT NULL
              -- FinTech, HealthTech, eCommerce, etc.
);

CREATE INDEX idx_mandate_sector ON mandate_sectors(mandate_id);
```

### `agencies`

```sql
CREATE TABLE agencies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) UNIQUE NOT NULL,  -- URL-friendly name
  website_url       VARCHAR(500),
  description       TEXT,
  founded_year      INTEGER,
  headcount_min     INTEGER,
  headcount_max     INTEGER,
  ev_estimate_min   INTEGER,           -- in thousands
  ev_estimate_max   INTEGER,           -- in thousands
  ev_currency       VARCHAR(3) DEFAULT 'GBP',
  hq_location       VARCHAR(255),
  open_to_offers    BOOLEAN DEFAULT FALSE,
  claimed           BOOLEAN DEFAULT FALSE,
  claimed_by        UUID REFERENCES users(id),
  claimed_at        TIMESTAMP,
  data_source       VARCHAR(50) DEFAULT 'scraped',
                    -- 'scraped', 'manual', 'imported', 'claimed'
  key_clients       TEXT,
  revenue_model     VARCHAR(50),       -- Retainer, Project, etc.
  status            VARCHAR(20) DEFAULT 'active',
                    -- 'active', 'inactive', 'pending_review'
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agency_slug ON agencies(slug);
CREATE INDEX idx_agency_claimed ON agencies(claimed);
CREATE INDEX idx_agency_open ON agencies(open_to_offers);
```

### `agency_services`

```sql
CREATE TABLE agency_services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  service     VARCHAR(100) NOT NULL
              -- same taxonomy as mandate_services
);

CREATE INDEX idx_agency_svc ON agency_services(agency_id);
CREATE INDEX idx_agency_svc_lookup ON agency_services(service);
```

### `agency_geographies`

```sql
CREATE TABLE agency_geographies (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  geography   VARCHAR(50) NOT NULL
);

CREATE INDEX idx_agency_geo ON agency_geographies(agency_id);
```

### `agency_sectors`

```sql
CREATE TABLE agency_sectors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  sector      VARCHAR(100) NOT NULL
);

CREATE INDEX idx_agency_sector ON agency_sectors(agency_id);
```

### `interest_registrations`

```sql
CREATE TABLE interest_registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id    UUID NOT NULL REFERENCES mandates(id),
  agency_id     UUID REFERENCES agencies(id),  -- if from a known agency
  contact_name  VARCHAR(255) NOT NULL,
  agency_name   VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  message       TEXT,
  status        VARCHAR(20) DEFAULT 'pending',
                -- 'pending', 'viewed', 'contacted', 'declined'
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_interest_mandate ON interest_registrations(mandate_id);
CREATE INDEX idx_interest_agency ON interest_registrations(agency_id);
```

### `matches`

Store computed matches for admin review:

```sql
CREATE TABLE matches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mandate_id    UUID NOT NULL REFERENCES mandates(id),
  agency_id     UUID NOT NULL REFERENCES agencies(id),
  score         DECIMAL(5,2) NOT NULL,    -- 0-100
  ev_match      BOOLEAN DEFAULT FALSE,
  geo_match     BOOLEAN DEFAULT FALSE,
  services_pct  DECIMAL(3,2) DEFAULT 0,   -- 0.0-1.0
  headcount_match BOOLEAN DEFAULT FALSE,
  sector_match  BOOLEAN DEFAULT FALSE,
  open_to_offers BOOLEAN DEFAULT FALSE,
  status        VARCHAR(20) DEFAULT 'new',
                -- 'new', 'reviewed', 'actioned', 'dismissed'
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_match_pair ON matches(mandate_id, agency_id);
CREATE INDEX idx_match_mandate ON matches(mandate_id);
CREATE INDEX idx_match_score ON matches(score DESC);
```

### `verification_tokens`

For email verification / magic links:

```sql
CREATE TABLE verification_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) NOT NULL,
  token       VARCHAR(255) UNIQUE NOT NULL,
  type        VARCHAR(20) NOT NULL,    -- 'claim', 'login', 'verify'
  agency_id   UUID REFERENCES agencies(id),
  expires_at  TIMESTAMP NOT NULL,
  used_at     TIMESTAMP,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_token_lookup ON verification_tokens(token);
```

---

## Prisma Schema (Alternative)

If using Prisma ORM:

```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String?
  name           String?
  role           String    @default("buyer") // buyer, agency_owner, admin
  emailVerified  Boolean   @default(false)
  agency         Agency?   @relation(fields: [agencyId], references: [id])
  agencyId       String?
  mandates       Mandate[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Mandate {
  id            String   @id @default(uuid())
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  evMin         Int?
  evMax         Int?
  evCurrency    String   @default("GBP")
  headcountMin  Int?
  headcountMax  Int?
  geographies   String[] // ["UK", "US", "EU"]
  services      String[] // ["SEO", "PPC"]
  sectors       String[] // ["FinTech", "eCommerce"]
  buyerType     String?
  dealStructure String[]
  timeline      String?
  revenueModel  String[]
  notes         String?
  status        String   @default("active")
  interests     InterestRegistration[]
  matches       Match[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Agency {
  id              String    @id @default(uuid())
  name            String
  slug            String    @unique
  websiteUrl      String?
  description     String?
  foundedYear     Int?
  headcountMin    Int?
  headcountMax    Int?
  evEstimateMin   Int?
  evEstimateMax   Int?
  evCurrency      String    @default("GBP")
  hqLocation      String?
  services        String[]
  geographies     String[]
  sectors         String[]
  openToOffers    Boolean   @default(false)
  claimed         Boolean   @default(false)
  claimedBy       User?
  claimedAt       DateTime?
  dataSource      String    @default("scraped")
  keyClients      String?
  revenueModel    String?
  status          String    @default("active")
  interests       InterestRegistration[]
  matches         Match[]
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model InterestRegistration {
  id          String   @id @default(uuid())
  mandate     Mandate  @relation(fields: [mandateId], references: [id])
  mandateId   String
  agency      Agency?  @relation(fields: [agencyId], references: [id])
  agencyId    String?
  contactName String
  agencyName  String
  email       String
  message     String?
  status      String   @default("pending")
  createdAt   DateTime @default(now())
}

model Match {
  id             String   @id @default(uuid())
  mandate        Mandate  @relation(fields: [mandateId], references: [id])
  mandateId      String
  agency         Agency   @relation(fields: [agencyId], references: [id])
  agencyId       String
  score          Float
  evMatch        Boolean  @default(false)
  geoMatch       Boolean  @default(false)
  servicesPct    Float    @default(0)
  headcountMatch Boolean  @default(false)
  sectorMatch    Boolean  @default(false)
  openToOffers   Boolean  @default(false)
  status         String   @default("new")
  createdAt      DateTime @default(now())

  @@unique([mandateId, agencyId])
}
```

---

## Enum / Constant Values

### Services Taxonomy

```json
[
  "SEO / Organic Search",
  "PPC / Paid Search",
  "Paid Social",
  "Organic Social / Content",
  "Programmatic / Display",
  "Performance Marketing",
  "Brand Strategy / Creative",
  "Web Design / Development",
  "CRO / UX",
  "Email / CRM / Marketing Automation",
  "PR / Comms",
  "Influencer Marketing",
  "Video / Production",
  "Data / Analytics",
  "AI / MarTech",
  "Full Service / Integrated"
]
```

### Geographies

```json
["UK", "US", "EU", "APAC", "MENA", "LATAM", "Global"]
```

### EV Brackets (in thousands)

```json
[
  { "label": "<£1m", "min": 0, "max": 1000 },
  { "label": "£1–3m", "min": 1000, "max": 3000 },
  { "label": "£3–5m", "min": 3000, "max": 5000 },
  { "label": "£5–8m", "min": 5000, "max": 8000 },
  { "label": "£8–15m", "min": 8000, "max": 15000 },
  { "label": "£15–30m", "min": 15000, "max": 30000 },
  { "label": "£30m+", "min": 30000, "max": null }
]
```

### Headcount Brackets

```json
[
  { "label": "1–10", "min": 1, "max": 10 },
  { "label": "11–25", "min": 11, "max": 25 },
  { "label": "26–50", "min": 26, "max": 50 },
  { "label": "51–100", "min": 51, "max": 100 },
  { "label": "100–250", "min": 100, "max": 250 },
  { "label": "250+", "min": 250, "max": null }
]
```

### Buyer Types

```json
["PE-backed", "Independent", "Strategic", "Family Office", "Search Fund"]
```

### Common Sectors

```json
[
  "FinTech", "HealthTech", "eCommerce", "B2B SaaS", "DTC",
  "EdTech", "PropTech", "Travel", "Automotive", "FMCG",
  "Financial Services", "Pharma / Life Sciences", "Retail",
  "Gaming", "Media / Entertainment", "Charity / Non-Profit"
]
```

---

## API Routes

Recommended route structure:

```
# Mandates
POST   /api/mandates              - Create mandate (auth required)
GET    /api/mandates              - List active mandates (public, anonymised)
GET    /api/mandates/:id          - Get mandate detail (public, anonymised)
PUT    /api/mandates/:id          - Update mandate (owner only)
PATCH  /api/mandates/:id/status   - Pause/activate/archive (owner only)
GET    /api/mandates/mine         - List my mandates (auth required)

# Interest Registrations
POST   /api/mandates/:id/interest - Register interest (public)
GET    /api/mandates/:id/interest - List interest for mandate (owner only)

# Agencies
GET    /api/agencies              - List agencies (public)
GET    /api/agencies/:slug        - Get agency profile (public)
POST   /api/agencies/:id/claim    - Start claim flow (sends verification)
POST   /api/agencies/claim/verify - Verify claim token
PUT    /api/agencies/:id          - Update agency (claimed owner only)
POST   /api/agencies              - Add new agency (admin or self-add)

# Auth
POST   /api/auth/register         - Create account (buyer)
POST   /api/auth/login             - Login
POST   /api/auth/magic-link        - Send magic link
POST   /api/auth/verify            - Verify magic link token

# Admin
GET    /api/admin/agencies         - All agencies with claim status
GET    /api/admin/matches          - Recent matches
GET    /api/admin/review-queue     - Pending manual reviews
PATCH  /api/admin/agencies/:id     - Admin update agency
```

-- Phase 13: Teams & Enterprise Plans
-- teams + team_members tables with RLS

-- ─── Teams ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS teams (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                    TEXT NOT NULL,
  owner_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                    TEXT NOT NULL DEFAULT 'team' CHECK (plan IN ('team', 'enterprise')),
  seat_count              INTEGER NOT NULL DEFAULT 3,
  stripe_subscription_id  TEXT,
  stripe_customer_id      TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS teams_owner_id_idx ON teams(owner_id);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Team owners and members can read their team
CREATE POLICY "team_members_read_team"
  ON teams FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT team_id FROM team_members
      WHERE user_id = auth.uid()
      AND accepted_at IS NOT NULL
    )
  );

-- Service role full access
CREATE POLICY "service_role_manage_teams"
  ON teams FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── Team Members ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS team_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id         UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role            TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  invited_email   TEXT,
  accepted_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_members_team_id_idx ON team_members(team_id);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON team_members(user_id);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Members can read their own team's membership list
CREATE POLICY "team_members_read_own_team"
  ON team_members FOR SELECT
  TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM team_members tm2
      WHERE tm2.user_id = auth.uid()
      AND tm2.accepted_at IS NOT NULL
    )
  );

-- Service role full access
CREATE POLICY "service_role_manage_team_members"
  ON team_members FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ─── Updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_teams_updated_at();

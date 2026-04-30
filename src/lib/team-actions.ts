"use server";

// src/lib/team-actions.ts
// Team and enterprise plan management

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { type Team, type TeamMember, type TeamUsageStats, TEAM_PLANS, type TeamPlanId } from "@/lib/team-types";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-03-25.dahlia",
  });
}

// ─── Create Team ──────────────────────────────────────────────────────────────

export async function createTeam(
  name: string,
  planId: TeamPlanId,
  seatCount: number
): Promise<{ team?: Team; checkoutUrl?: string; error?: string }> {
  try {
    const stripe = getStripe();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    const plan = TEAM_PLANS[planId];
    if (seatCount < plan.min_seats || seatCount > plan.max_seats) {
      return { error: `Seat count must be between ${plan.min_seats} and ${plan.max_seats}` };
    }

    // Create team record
    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: team, error: teamError } = await serviceClient
      .from("teams")
      .insert({
        name,
        owner_id: user.id,
        plan: planId,
        seat_count: seatCount,
      })
      .select("*")
      .single();

    if (teamError || !team) return { error: teamError?.message ?? "Failed to create team" };

    // Add owner as first member
    await serviceClient.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
      accepted_at: new Date().toISOString(),
    });

    // Create Stripe checkout for team subscription
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();

    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email ?? "",
      name: profile?.full_name ?? undefined,
      metadata: { user_id: user.id, team_id: team.id },
    });

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: plan.stripe_price_id, quantity: seatCount }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/team?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/dashboard/team?canceled=true`,
      metadata: { team_id: team.id, plan_id: planId },
    });

    // Save customer ID to team
    await serviceClient
      .from("teams")
      .update({ stripe_customer_id: customer.id })
      .eq("id", team.id);

    return { team: team as Team, checkoutUrl: session.url ?? undefined };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create team" };
  }
}

// ─── Invite Team Member ───────────────────────────────────────────────────────

export async function inviteTeamMember(
  teamId: string,
  email: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Verify requester is owner or admin
    const { data: membership } = await supabase
      .from("team_members")
      .select("role")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .single();

    if (!membership || !["owner", "admin"].includes(membership.role)) {
      return { error: "Insufficient permissions" };
    }

    // Check seat availability
    const { data: team } = await supabase
      .from("teams")
      .select("seat_count")
      .eq("id", teamId)
      .single();

    const { count: memberCount } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId)
      .not("accepted_at", "is", null);

    if ((memberCount ?? 0) >= (team?.seat_count ?? 0)) {
      return { error: "No seats available. Upgrade your plan to add more members." };
    }

    const serviceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if user already exists
    const { data: existingUser } = await serviceClient.auth.admin.listUsers();
    const invitedUser = existingUser?.users?.find((u) => u.email === email);

    await serviceClient.from("team_members").insert({
      team_id: teamId,
      user_id: invitedUser?.id ?? null,
      role: "member",
      invited_email: email,
      accepted_at: invitedUser ? new Date().toISOString() : null,
    });

    return { success: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to invite member" };
  }
}

// ─── Get Team ─────────────────────────────────────────────────────────────────

export async function getTeam(): Promise<{
  team?: Team;
  members?: TeamMember[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Find team where user is a member
    const { data: membership } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .not("accepted_at", "is", null)
      .single();

    if (!membership) return { error: "Not a member of any team" };

    const { data: team } = await supabase
      .from("teams")
      .select("*")
      .eq("id", membership.team_id)
      .single();

    const { data: members } = await supabase
      .from("team_members")
      .select("*")
      .eq("team_id", membership.team_id)
      .order("created_at", { ascending: true });

    return { team: team as Team, members: (members ?? []) as TeamMember[] };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to get team" };
  }
}

// ─── Get Team Usage Stats ─────────────────────────────────────────────────────

export async function getTeamUsageStats(teamId: string): Promise<{
  stats?: TeamUsageStats;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data: members } = await supabase
      .from("team_members")
      .select("user_id")
      .eq("team_id", teamId)
      .not("accepted_at", "is", null);

    const userIds = (members ?? []).map((m) => m.user_id).filter(Boolean);

    const monthBucket = new Date().toISOString().slice(0, 7);

    const { count: tailoringCount } = await supabase
      .from("usage_logs")
      .select("*", { count: "exact", head: true })
      .in("user_id", userIds)
      .eq("feature", "tailoring")
      .eq("month_bucket", monthBucket);

    const { count: applicationCount } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .in("user_id", userIds);

    const { count: resumeCount } = await supabase
      .from("resumes")
      .select("*", { count: "exact", head: true })
      .in("user_id", userIds);

    return {
      stats: {
        team_id: teamId,
        total_members: userIds.length,
        active_members: userIds.length,
        total_tailoring_this_month: tailoringCount ?? 0,
        total_applications: applicationCount ?? 0,
        total_resumes: resumeCount ?? 0,
      },
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to get team stats" };
  }
}

import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AdminUser {
  id: string;
  email: string;
}

interface AdminProfileRow {
  id: string;
  user_id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
}

async function verifySuperAdmin(req: Request): Promise<{ ok: true; adminClient: ReturnType<typeof createClient> } | { ok: false; status: number; body: { error: string } }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return { ok: false, status: 401, body: { error: "Missing authorization header" } };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey) {
    return { ok: false, status: 500, body: { error: "Server configuration error" } };
  }

  // Create a client with the caller's token to check their identity
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return { ok: false, status: 401, body: { error: "Invalid or expired session" } };
  }

  // Check the caller's role in admin_profiles
  const { data: profile, error: profileError } = await userClient
    .from("admin_profiles")
    .select("role, is_active")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError || !profile || profile.role !== "super_admin" || !profile.is_active) {
    return { ok: false, status: 403, body: { error: "Super admin access required" } };
  }

  if (!serviceKey) {
    return { ok: false, status: 500, body: { error: "Service role not configured" } };
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return { ok: true, adminClient };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const verification = await verifySuperAdmin(req);
    if (!verification.ok) {
      return new Response(JSON.stringify(verification.body), {
        status: verification.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { adminClient } = verification;
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // GET: list users
    if (req.method === "GET") {
      const { data: profiles, error: profileError } = await adminClient
        .from("admin_profiles")
        .select("id, user_id, full_name, role, is_active, created_at, last_login_at")
        .order("created_at", { ascending: false });

      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: authUsers, error: authError } = await adminClient.auth.admin.listUsers();
      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const emailMap = new Map<string, string>();
      if (authUsers?.users) {
        for (const u of authUsers.users) {
          emailMap.set(u.id, u.email || "");
        }
      }

      const users = (profiles as AdminProfileRow[]).map((p) => ({
        id: p.id,
        userId: p.user_id,
        email: emailMap.get(p.user_id) || "",
        fullName: p.full_name,
        role: p.role,
        isActive: p.is_active,
        createdAt: p.created_at,
        lastLoginAt: p.last_login_at,
      }));

      return new Response(JSON.stringify({ users }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST: create user or reset password
    if (req.method === "POST") {
      const body = await req.json();

      if (action === "reset-password") {
        const { userId, newPassword } = body as { userId: string; newPassword: string };
        if (!userId || !newPassword) {
          return new Response(JSON.stringify({ error: "userId and newPassword are required" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (newPassword.length < 6) {
          return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { error: updateError } = await adminClient.auth.admin.updateUserById(userId, { password: newPassword });
        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create user
      const { email, password, fullName, role } = body as { email: string; password: string; fullName: string; role: string };
      if (!email || !password || !fullName) {
        return new Response(JSON.stringify({ error: "email, password, and fullName are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ error: "Invalid email address" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (password.length < 6) {
        return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (role !== "admin" && role !== "super_admin") {
        return new Response(JSON.stringify({ error: "Invalid role" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!authData.user) {
        return new Response(JSON.stringify({ error: "Failed to create user" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: profileError } = await adminClient.from("admin_profiles").insert({
        id: crypto.randomUUID(),
        user_id: authData.user.id,
        full_name: fullName,
        role,
        is_active: true,
        is_admin: true,
      });

      if (profileError) {
        // Best-effort cleanup: delete the auth user if profile insert failed
        await adminClient.auth.admin.deleteUser(authData.user.id);
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT: update user profile
    if (req.method === "PUT") {
      const body = await req.json();
      const { id, fullName, role, isActive } = body as { id: string; fullName?: string; role?: string; isActive?: boolean };

      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const updates: Record<string, unknown> = {};
      if (fullName !== undefined) updates.full_name = fullName;
      if (role !== undefined) {
        if (role !== "admin" && role !== "super_admin") {
          return new Response(JSON.stringify({ error: "Invalid role" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        updates.role = role;
      }
      if (isActive !== undefined) updates.is_active = isActive;

      const { error: updateError } = await adminClient.from("admin_profiles").update(updates).eq("id", id);
      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE: delete user
    if (req.method === "DELETE") {
      const body = await req.json();
      const { id, userId } = body as { id: string; userId: string };

      if (!id || !userId) {
        return new Response(JSON.stringify({ error: "id and userId are required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: profileError } = await adminClient.from("admin_profiles").delete().eq("id", id);
      if (profileError) {
        return new Response(JSON.stringify({ error: profileError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error: authError } = await adminClient.auth.admin.deleteUser(userId);
      if (authError) {
        return new Response(JSON.stringify({ error: authError.message }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

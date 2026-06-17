import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Load .env.local
if (fs.existsSync(".env.local")) {
  const envFile = fs.readFileSync(".env.local", "utf8");
  for (const line of envFile.split("\n")) {
    const parts = line.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = val;
    }
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Missing Supabase URL or Anon Key in env");
  process.exit(1);
}

const supabase = createClient(url, anonKey);

async function run() {
  console.log("--- MEGA MENU SECTIONS ---");
  const { data: sections, error: secErr } = await supabase.from("mega_menu_sections").select("*");
  if (secErr) console.error("Sections error:", secErr);
  else console.log(JSON.stringify(sections, null, 2));

  console.log("\n--- MENU ITEMS ---");
  const { data: menuItems, error: menuErr } = await supabase.from("menu_items").select("*");
  if (menuErr) console.error("Menu Items error:", menuErr);
  else console.log(JSON.stringify(menuItems, null, 2));

  console.log("\n--- SERVICES ---");
  const { data: services, error: serErr } = await supabase.from("services").select("*");
  if (serErr) console.error("Services error:", serErr);
  else console.log(JSON.stringify(services, null, 2));
}

run();

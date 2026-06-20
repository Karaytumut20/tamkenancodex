import { createClient } from "@supabase/supabase-js";
import fs from "fs";

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
const supabase = createClient(url, anonKey);

async function run() {
  const { data: sections, error } = await supabase.from("mega_menu_sections").select("id, menu_key, title");
  if (error) console.error(error);
  else console.log(sections);
}
run();

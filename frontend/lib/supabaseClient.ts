import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kfkwgwxfhtgjipefigrg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtma3dnd3hmaHRnamlwZWZpZ3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExMDU4ODMsImV4cCI6MjA4NjY4MTg4M30.b2HdpWgu0tTsW1hHJ6N5GwClmGP2hEd5iwx2mbwPxl8"
);

import { createClient } from '@supabase/supabase-js';

// Gantilah dengan URL dan public API key dari proyek Supabase Anda
const supabaseUrl = 'https://dtjrketxxozstcwvotzh.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0anJrZXR4eG96c3Rjd3ZvdHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMDI4NTEsImV4cCI6MjA0NzU3ODg1MX0.y65gEUjwe9NnfuahEFPc88O_wTW7GudzARgCl6CU1kE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

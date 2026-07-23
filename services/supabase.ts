import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gikucxbdaieiagzqsgzz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdpa3VjeGJkYWllaWFnenFzZ3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MDU1MjUsImV4cCI6MjEwMDM4MTUyNX0.n7mY01UpSpEKymEhrmAT0ayQ18lvJLEaPeSNsoMOOBc';

export const supabase = createClient(supabaseUrl, supabaseKey);
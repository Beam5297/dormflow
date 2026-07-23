import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gikucxbdaieiagzqsgzz.supabase.co';
const supabaseKey = 'sb_publishable_XR8gTREO-Teb7z1oqdcqaQ_Jc9tFW-Q';

export const supabase = createClient(supabaseUrl, supabaseKey);
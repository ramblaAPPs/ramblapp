import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function savePostToDatabase(post) {
  const { error } = await supabase
    .from('search_results')
    .insert([post]);

  if (error) {
    console.error('Error saving post to database:', error);
    throw error;
  }
}

/* no enviaba nada a supabase ....

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
*/

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function savePostToDatabase(post) {
  const { error } = await supabase
    .from('search_results') // Asegúrate de que el nombre de la tabla esté correcto aquí
    .insert([
      {
        artist_id: post.artist_id,
        album_name: post.album_name,
        release_date: post.release_date,
        image_url: post.image_url,
      },
    ]);

  if (error) {
    console.error('Error saving post to database:', error);
    throw error;
  }
}

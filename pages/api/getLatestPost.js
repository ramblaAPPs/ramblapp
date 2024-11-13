import { getSpotifyToken, fetchLatestPost } from '../../lib/spotify';
import { savePostToDatabase } from '../../lib/supabase';

export default async function handler(req, res) {
  try {
    const token = await getSpotifyToken();
    const latestPost = await fetchLatestPost(req.query.artistId, token);

    if (!latestPost) {
      return res.status(404).json({ message: 'No posts found' });
    }

    await savePostToDatabase(latestPost);

    res.status(200).json(latestPost);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the latest post' });
  }
}

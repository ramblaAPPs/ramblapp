import { useState } from 'react';

export default function Home() {
  const [artistId, setArtistId] = useState('');
  const [post, setPost] = useState(null);

  const handleFetchPost = async () => {
    try {
      const response = await fetch(`/api/getLatestPost?artistId=${artistId}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Spotify Latest Post Prototype</h1>
      <input
        type="text"
        placeholder="Enter Artist ID"
        value={artistId}
        onChange={(e) => setArtistId(e.target.value)}
      />
      <button onClick={handleFetchPost}>Fetch Latest Post</button>

      {post && (
        <div style={{ marginTop: '20px' }}>
          <h2>Latest Post</h2>
          <p>Album Name: {post.name}</p>
          <p>Release Date: {post.release_date}</p>
          <img src={post.images[0].url} alt="Album cover" width="200" />
        </div>
      )}
    </div>
  );
}

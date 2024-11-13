import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [post, setPost] = useState(null);

  // Función para buscar artistas por nombre
  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/searchArtist?query=${query}`);
      const data = await response.json();
      setArtists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching artist:', error);
      setArtists([]);
    }
  };

  // Función para obtener la última publicación de un artista
  const handleFetchPost = async (artistId, artistName) => {
    try {
      const response = await fetch(`/api/getLatestPost?artistId=${artistId}&artistName=${encodeURIComponent(artistName)}`);
      const data = await response.json();
      setPost(data.latestPost);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Spotify Latest Post Prototype</h1>
      <input
        type="text"
        placeholder="Search for an artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {artists.map((artist) => (
          <div key={artist.id} style={{ marginTop: '10px' }}>
            <p>{artist.name}</p>
            <button onClick={() => handleFetchPost(artist.id, artist.name)}>
              Get Latest Post
            </button>
          </div>
        ))}
      </div>

      {post && (
        <div style={{ marginTop: '20px' }}>
          <h2>Última Publicación</h2>
          <p>Título: {post.name}</p>
          <p>Tipo: {post.album_type === 'single' ? 'Canción' : post.album_type === 'album' ? 'Álbum' : 'EP'}</p>
          
          {post.album_type === 'single' && post.tracks?.items.length === 1 && (
            <p>Duración: {(post.tracks.items[0].duration_ms / 60000).toFixed(2)} min</p>
          )}

          {post.album_type !== 'single' && post.tracks?.items && (
            <div>
              <h3>Listado de canciones:</h3>
              <ul>
                {post.tracks.items.map((track) => (
                  <li key={track.id}>
                    {track.track_number}. {track.name} - {(track.duration_ms / 60000).toFixed(2)} min
                  </li>
                ))}
              </ul>
            </div>
          )}

          <a href={post.external_urls?.spotify || '#'} target="_blank" rel="noopener noreferrer">
            Ver en Spotify
          </a>
          <p>Fecha de Lanzamiento: {post.release_date}</p>
          <img src={post.images?.[0]?.url || ''} alt={post.name} width="200" />
        </div>
      )}
    </div>
  );
}

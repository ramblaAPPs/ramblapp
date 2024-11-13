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

      // Verificar si data es un array; si no, asigna un array vacío
      setArtists(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error searching artist:', error);
      setArtists([]);
    }
  };

  // Función para obtener la última publicación de un artista
  const handleFetchPost = async (artistId) => {
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
        placeholder="Search for an artist"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Ejecuta búsqueda al presionar "Enter"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Mostrar resultados de búsqueda */}
      <div>
        {artists.map((artist) => (
          <div key={artist.id} style={{ marginTop: '10px' }}>
            <p>{artist.name}</p>
            <button onClick={() => handleFetchPost(artist.id)}>
              Get Latest Post
            </button>
          </div>
        ))}
      </div>

      {/* Mostrar la última publicación */}
      {post && (
        <div style={{ marginTop: '20px' }}>
          <h2>Latest Post</h2>
          <p>Album Name: {post.name}</p>
          <p>Release Date: {post.release_date}</p>
          <img src={post.images?.[0]?.url || ''} alt="Album cover" width="200" />
        </div>
      )}
    </div>
  );
}

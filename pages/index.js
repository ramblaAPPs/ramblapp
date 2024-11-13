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
    <h2>Última Publicación</h2>
    <p>Título: {post.name}</p>
    <p>Tipo: {post.album_type === 'single' ? 'Canción' : post.album_type === 'album' ? 'Álbum' : 'EP'}</p>
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

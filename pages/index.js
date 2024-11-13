import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [post, setPost] = useState(null);
  const [artistResults, setArtistResults] = useState([]); // Para almacenar los resultados del artista
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

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

  // Función para obtener todos los resultados de la base de datos para un artista
  const handleViewResults = async (artistId) => {
    try {
      const response = await fetch(`/api/getArtistResults?artistId=${artistId}`);
      const data = await response.json();
      setArtistResults(data);
      setShowModal(true); // Mostrar el modal
    } catch (error) {
      console.error('Error fetching artist results:', error);
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

      {/* Mostrar resultados de búsqueda */}
      <div>
        {artists.map((artist) => (
          <div key={artist.id} style={{ marginTop: '10px' }}>
            <p>{artist.name}</p>
            <button onClick={() => handleFetchPost(artist.id, artist.name)}>Get Latest Post</button>
            <button onClick={() => handleViewResults(artist.id)}>View All Results</button>
          </div>
        ))}
      </div>

      {/* Mostrar la última publicación */}
      {post && (
        <div style={{ marginTop: '20px' }}>
          <h2>Última Publicación</h2>
          <p>Título: {post.name}</p>
          <p>Tipo: {post.album_type === 'single' ? 'Canción' : post.album_type === 'album' ? 'Álbum' : 'EP'}</p>
          <a href={post.external_urls?.spotify || '#'} target="_blank" rel="noopener noreferrer">Ver en Spotify</a>
          <p>Fecha de Lanzamiento: {post.release_date}</p>
          <img src={post.images?.[0]?.url || ''} alt={post.name} width="200" />
        </div>
      )}

      {/* Modal para mostrar los resultados del artista */}
      {showModal && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}>
          <h3>Resultados Guardados para el Artista</h3>
          <button onClick={() => setShowModal(false)}>Cerrar</button>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {artistResults.map(result => (
              <li key={result.id} style={{ margin: '10px 0', borderBottom: '1px solid #ccc' }}>
                <p>Fecha de Creación: {new Date(result.created_at).toLocaleString()}</p>
                <p>Artista: {result.artist_name}</p>
                <p>Título: {result.title}</p>
                <p>Tipo: {result.type}</p>
                <p>Fecha de Lanzamiento: {result.release_date}</p>
                <a href={result.url} target="_blank" rel="noopener noreferrer">Ver en Spotify</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

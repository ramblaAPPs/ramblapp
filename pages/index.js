import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [post, setPost] = useState(null);

  // Función para buscar artistas por nombre
  const handleSearch = async () => {
    if (query.trim() === '') return; // Evita buscar si el campo está vacío
    try {
      const response = await fetch(`/api/searchArtist?query=${query}`);
      const data = await response.json();
      setArtists(data.artists.items); // Guardar resultados de búsqueda
    } catch (error) {
      console.error('Error searching artist:', error);
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

  // Manejar la tecla "Enter" para cargar los resultados de búsqueda
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
        onKeyPress={handleKeyPress} // Llama a la función cuando se presiona "Enter"
      />

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
          <img src={post.images[0].url} alt="Album cover" width="200" />
        </div>
      )}
    </div>
  );
}

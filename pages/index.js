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
      <button onClick={handleSearch}>Search</button> {/* Botón de búsqueda */}

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
     // Mostrar el último lanzamiento y las canciones si están presentes
{latestPost && (
  <div>
    <h2>{latestPost.name}</h2>
    <p>Release Date: {latestPost.release_date}</p>
    <img src={latestPost.images[0].url} alt={latestPost.name} width="200" />

    {latestPost.tracks && (
      <div>
        <h3>Tracks:</h3>
        <ul>
          {latestPost.tracks.map((track) => (
            <li key={track.id}>{track.name}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}

    </div>
  );
}

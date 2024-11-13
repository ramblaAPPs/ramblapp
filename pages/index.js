import { getSpotifyToken, fetchLatestPost } from '../lib/spotify';

export default function Home({ latestPost }) {
  return (
    <>
      {latestPost ? (
        <div>
          <h2>{latestPost.name}</h2>
          <p>Release Date: {latestPost.release_date}</p>
          <img src={latestPost.images[0]?.url} alt={latestPost.name} width="200" />

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
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

// Función para obtener los datos en el servidor
export async function getServerSideProps() {
  try {
    const token = await getSpotifyToken();
    const artistId = 'tu_artist_id'; // Reemplaza esto con el ID del artista deseado
    const latestPost = await fetchLatestPost(artistId, token);

    return {
      props: {
        latestPost: latestPost || null,
      },
    };
  } catch (error) {
    console.error('Error fetching latest post:', error);
    return {
      props: {
        latestPost: null,
      },
    };
  }
}

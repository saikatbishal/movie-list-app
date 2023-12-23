import { IMAGE_BASE_URL } from '../constants/base_urls'
const MovieCard = ({title,poster_path}:any) => {
  const DUMMY_DATA = [
    {
      adult: false,
      backdrop_path: "/vG6JxKspnlub1Ue3xhktOtE5FVJ.jpg",
      genre_ids: [35, 18],
      id: 87428,
      original_language: "en",
      original_title: "That's My Boy",
      overview:
        "While in his teens, Donny fathered a son, Todd, and raised him as a single parent up until Todd's 18th birthday. Now, after not seeing each other for years, Todd's world comes crashing down when Donny resurfaces just before Todd's wedding.",
      popularity: 45.588,
      poster_path: "/oVCsANNQyw1AjRhQ9edFBM8HVCq.jpg",
      release_date: "2012-06-14",
      title: "That's My Boy",
      video: false,
      vote_average: 5.8,
      vote_count: 1782,
    },
  ];
  /**
   * movie title, image, genre, cast, director, and a short description
   */
  return (
    <div>
        <img src = {`${IMAGE_BASE_URL}${poster_path}`} alt={title}/>
    </div>
  )
}

export default MovieCard
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { getGenreList } from "./api/genreListApi";
import "./App.css";
import { BASE_URL } from "./constants/base_urls";
import HorizontalScroll from "./horizontalScroll/HorizontalScroll";
import MoviesList from "./moviesList/MoviesList";
import SearchBox from "./searchBox/SearchBox";
import { moviesListType, dataType } from "./types/moviesListType";
import { API_KEY } from "./constants/API_KEY";

function App() {
  const primaryReleaseYear = [2012];
  const [moviesData, setMoviesData] = useState<moviesListType[]>([]); // fetch data
  const [genreList, setGenreList] = useState<any[]>([]); // fetch data
  const [error, setError] = useState<boolean>(false); 
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<number[]>([1]);
  const [selectedYears, setSelectedYears] = useState(primaryReleaseYear);

  const intialParams = [
    { vote_count_gte: 100 },
    { sort_by: "popularity.desc" },
    { api_key: API_KEY },
    { primary_release_year: primaryReleaseYear },
  ];
  const initialSelectedGenre = { id: 1, name: "All" };
  const containerRef = useRef<HTMLDivElement>(null);

  async function handleGenreList() {
    try {
      const list = await getGenreList();
      setGenreList([initialSelectedGenre, ...list.genres]);
    } catch {
      setError(true);
    }
  }
  function handleScroll(prop: "UP" | "DOWN") {
    switch (prop) {
      case "UP":
        let tempYearArray = [...selectedYears];
        tempYearArray.unshift(tempYearArray[0] - 1);
        setSelectedYears(tempYearArray);
        break;
      case "DOWN":
        tempYearArray = [...selectedYears];
        tempYearArray.push(tempYearArray[tempYearArray.length - 1] + 1);
        setSelectedYears(tempYearArray);
        break;
      default:
        console.log("undefined action");
    }
  }
  async function fetchScrollData() {

  }
  async function fetchData() {
    let data: dataType;
    try {
      const params = new URLSearchParams();
      intialParams.forEach((each:Record<string,any>) => {
        for (const key in each) params.append(key, each[key]);
      });
      params.append("with_text_query", query);
      params.append(
        "with_genres",
        selectedGenre[0] === 1 && selectedGenre.length === 1
          ? ""
          : selectedGenre.join("|")
      );
      const result = await fetch(`${BASE_URL}?${params}`);

      data = await result.json();
      setMoviesData([data.results]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData();
  }, [query, selectedGenre]);
  useEffect(() => {
    fetchScrollData();
  }, [selectedYears]);
  useEffect(() => {
    handleGenreList();
  }, []);
  return (
    <div className="App">
      {!error ? (
        <HorizontalScroll
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          items={genreList}
        />
      ) : (
        <div>Failed to fetch Genres</div>
      )}
      <SearchBox query={query} setQuery={setQuery} />
      <button onClick={() => handleScroll("UP")}>Scroll Up</button>
      {moviesData.length === 0 ? (
        <div>No Data found</div>
      ) : (
        <div className="movies-container" ref={containerRef}>
          {moviesData.map((data: any) => {
            return <MoviesList data={data} />;
          })}
        </div>
      )}
      <button onClick={() => handleScroll("DOWN")}>Scroll Down</button>
    </div>
  );
}

export default App;

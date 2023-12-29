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
  const [scrollDirection, setScrollDirection] = useState<"UP" | "DOWN" | "">(
    ""
  );
  const [scrollPosition, setScrollPosition] = useState<number>(10);
  const intialParams = [
    { vote_count_gte: 100 },
    { sort_by: "popularity.desc" },
    { api_key: API_KEY },
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
    
    setScrollDirection(prop);
    switch (prop) {
      case "UP":
        setSelectedYears(arr=>[arr[0] - 1, ...arr]);
        break;
      case "DOWN":
        setSelectedYears(arr=>[...arr,arr[arr.length-1]+1]);
        break;
      default:
        console.log("undefined action");
        setScrollDirection("");
    }
  }
  async function fetchScrollData() {
    let data: dataType;
    try {
      const params = new URLSearchParams();
      intialParams.forEach((each: Record<string, any>) => {
        for (const key in each) params.append(key, each[key]);
      });
      params.append("with_text_query", query);
      params.append(
        "with_genres",
        selectedGenre[0] === 1 && selectedGenre.length === 1
          ? ""
          : selectedGenre.join("|")
      );
      if (scrollDirection === "UP") {
        params.append("primary_release_year", selectedYears[0].toString());
      } else if (scrollDirection === "DOWN") {
        params.append(
          "primary_release_year",
          selectedYears[selectedYears.length - 1].toString()
        );
      }
      const result = await fetch(`${BASE_URL}?${params}`);
      data = await result.json();
      console.log(data.results);
      if (scrollDirection === "UP") {
        setMoviesData((c) => [data.results, ...c]);
      } else if (scrollDirection === "DOWN") {
        setMoviesData((c) => [...c, data.results]);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function fetchData() {
    setSelectedYears([2012]);
    let data: dataType;
    try {
      const params = new URLSearchParams();
      intialParams.forEach((each: Record<string, any>) => {
        for (const key in each) params.append(key, each[key]);
      });
      params.append("with_text_query", query);
      params.append("primary_release_year", "2012");

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
    window.addEventListener("scroll", () => {
      setScrollPosition(window.scrollY);
      if (window.scrollY === 0) {
        handleScroll("UP");
        window.scrollTo(0,scrollPosition)
        
      } else if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight-10
      ) {
        handleScroll("DOWN");
      }
    })
  }, []);

  const loader = () => {
    return <div>Loading...</div>;
  };
  return (
    <div className="App" >
      
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

      {moviesData.length === 0 ? (
        <div>No Data found</div>
      ) : (
        <div className="movies-container" ref={containerRef}>
          
            {moviesData.map((data: any) => {
              return <MoviesList data={data} />;
            })}
        </div>
      )}
     </div>
  );
}

export default App;

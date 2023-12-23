/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { getGenreList } from "./api/genreListApi";
import "./App.css";
import { BASE_URL } from "./constants/base_urls";
import HorizontalScroll from "./horizontalScroll/HorizontalScroll";
import { moviesListType,dataType } from "./types/moviesListType";
function App() {
  const [moviesData, setMoviesData] = useState<moviesListType>([]);
  const [movieYears, setMovieYears] = useState<number[]>([2012]);
  const [selectedGenre, setSelectedGenre] = useState<number>(1)
  const [genreList,setGenreList] = useState<any[]>([])  
  const initialSelectedGenre = {id:1, name:"All"};

  async function handleGenreList() {
    const list = await getGenreList()
    setGenreList([initialSelectedGenre,...list.genres])
  }
    async function fetchData(movieYears: number[]) {
    let data: dataType;
    try {
      const result = await fetch(`${BASE_URL}`);
      data = await result.json();
      setMoviesData((c: moviesListType) => [...c, ...data.results]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchData(movieYears);
    handleGenreList();
  }, [movieYears]);
  return (
    <div className="App">
      <HorizontalScroll
      selectedGenre={selectedGenre}
      setSelectedGenre={setSelectedGenre}
        items={genreList}

      />

    </div>
  );
}

export default App;

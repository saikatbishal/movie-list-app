import { BASE_URL } from "../constants/base_urls";
import { dataType } from "../types/moviesListType";


export async function getMovieListApi(movieYears: number[]) {
    let data: dataType;
    try {
      const result = await fetch(`${BASE_URL}`);
      data = await result.json();
      return data.results;
    //   setMoviesData((c: moviesListType) => [...c, ...data.results]);
    } catch (err) {
      console.log(err);
    }
  }
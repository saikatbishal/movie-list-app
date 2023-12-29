export async function getGenreList(){
    const url = 'https://api.themoviedb.org/3/genre/movie/list?api_key=2dca580c2a14b55200e784d157207b4d';
    const options = {method: 'GET', headers: {accept: 'application/json'}};

const result = await fetch(url, options).then(res => res.json())
.then(json =>  json)
.catch(err => console.error('error:' + err));
return result
}

/**
 * API FILTERS
 * page=1
 * primary_release_year=2012
 * sort_by=popularity.desc
 * vote_count_gte = 100 
 */
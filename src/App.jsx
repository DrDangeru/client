import { React, useEffect, useState } from 'react';
import './App.css';

class Movie {
  constructor(movie, character, quote) {
    this.movie = movie;
    this.character = character;
    this.quote = quote;
  }
}

function App(props) {
  const [quotes, setQuotes] = useState([]); //maybe needed 
  const [postDataMovie, setPostDataMovie] = useState('');
  const [postDataCharacter, setPostDataCharacter] = useState('');
  const [postDataQuote, setPostDataQuote] = useState('');
  const[searchResult, saveSearchResult] = useState('');
  let id; // to pass for deletion
  let searchStr;
  

  const movieInstance = new Movie(postDataMovie, postDataCharacter,postDataQuote); // send whole movies pieced together from input.
  // useEffect(() => { //optional
  //   handleGet()
  // },[])

  async function handleGet(e) {
    e.preventDefault();
    fetch('http://localhost:3000/quote' ,{  // Assuming your server is running on the same domain
       method: 'GET'})
    .then( async response =>  {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    let  result = await response.json(); //this inits data prop with all res obj
        console.log(result,'this is result')
    return  result;// Pass the response as it is
    // data param is implicitly returned.. works with data.. works 
    //with results all the same .. with results its cleanly traceble
    // without the knowledge data prop appears as you run response.json
  })
  .then(result => {
            // Check if the 'quotes' property exists in the data object
            if (result.quotes && Array.isArray(result.quotes)) {
                setQuotes(result.quotes); // Set the state with the 'quotes' array
                console.log('Response data:', result.quotes);
            } else {
                console.error('Quotes not found in response:', result);
            }
        })
  .catch(error => {
    // Handle errors
    console.error('Error fetching data:', error);
  });
  }

 function handlePost(e) {
  e.preventDefault();
  const movieValue = postDataMovie;
  setPostDataMovie(movieValue);
  const characterValue = postDataCharacter;
  setPostDataCharacter(characterValue);
  const quoteValue = postDataQuote;
  setPostDataQuote(quoteValue);
console.log('Post data:', postDataMovie);
console.log('Char data:', postDataCharacter);
console.log('Quote data:', postDataQuote);
 buildMovieQuote(); 
}

async function buildMovieQuote(){
  let uploadMovie = new Movie(postDataMovie,postDataCharacter,postDataQuote);
    console.log('this is send quote', uploadMovie)
  await sendMovieQuote(uploadMovie);
}

async function sendMovieQuote(uploadMovie) {
  try {
    const response = await fetch('http://localhost:3000/quoteAdd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type 
      },
      body: JSON.stringify(uploadMovie), // Convert object to JSON string
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json(); // Parse the JSON in the response
    console.log('Response from server:', data);

    alert('Successfully added to db');
    return data; // Return the response data
  } catch (error) {
    console.log('Server did not receive the data: Retry', error);
    throw error; // Re-throw the error to handle it elsewhere if needed
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const searchStr = document.getElementById('searchStr').value.trim();
  const url = `http://localhost:3000/quote?searchStr=${searchStr}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ searchStr }), // Convert params to JSON
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.json();
    console.log('Response data:', result);

    if (result.quotes && Array.isArray(result.quotes)) {
      setQuotes(result.quotes); // Set the state with the 'quotes' array
      console.log('Response data:', result.quotes);
    } else {
      console.error('Quotes not found in response:', result);
    }
  } catch (error) {
    // Handle errors
    console.error('Error fetching data:', error);
  }
}


function handleDelete(e) {
    e.preventDefault();
    //send req to server
  }

  return (
    <div className="App">
      <div>Select From the below options!</div>
    
            {/* GET Request */}
      <div>
        <form id="getRequestForm" onSubmit={(e) => handleGet(e)}>
          <h3>GET Request</h3>
          <button type="submit">Send GET Request</button>
        </form>
      </div>

      <div>
 {(Array.isArray(quotes) && quotes.length > 0) &&
  quotes.map(quote => (
    <li key={quote.ID}>
      <div>Movie: {quote.movie}</div>
      <div>Quote: {quote.quote}</div>
      <div>Character: {quote.character}</div>
    </li>
  ))}

      <div>
            {/* SEARCH REQUEST */}
        <form id="Search" onSubmit={(e) => handleSearch(e)}>
          <h3>Search</h3>
          <label>Search by Movie,Quote or Character</label>
          <input 
            type="text"
            id="searchStr"
            name="searchStr"
            // value={searchStr}
          />
          <button type='submit' onClick={handleSearch}>Search now </button>
          </form>
        </div>

 <div>
    {quotes.map(quote => (
    <li key={quote.ID}>
        <div>Movie: {quote.movie}</div>
        <div>Quote: {quote.quote}</div>
        <div>Character: {quote.character}</div>
    </li>
    ))}

</div>
        {/* POST Request */}
    <form id="postRequestForm" onSubmit={(e) => handlePost(e)}>
          <h3>POST Request</h3>
          <label>Post Movie</label>
          <input required
            type="text"
            id="postDataMovie"
            name="postDataMovie"
            value={postDataMovie}
            onChange={(e) => setPostDataMovie(e.target.value)} // Update postData state
          />

            <label>Character</label>
               <input required
            type="text"
            id="postDataCharacter"
            name="postDataCharacter"
            value={postDataCharacter}
            onChange={(e) => setPostDataCharacter(e.target.value)} // Update postData state
          />
                 
            <label>Quote</label>
               <input required
            type="text"
            id="postDataQuote"
            name="postDataQuote"
            value={postDataQuote}
            onChange={(e) => setPostDataQuote(e.target.value)} // Update postData state
          />
          <button type="submit" onClick={handlePost}>
            Send POST Request
          </button>
        </form>
      </div>

      <div>
        {/* DELETE Request */}
  <form id="deleteRequestForm" onSubmit={(e) => handleDelete(e)}>
          <h3>DELETE Request</h3>
          <label>ID to Delete:</label>
          <input type="text" id="deleteId" name="deleteId" />
          <button type="submit" onClick={handleDelete}>
            Send DELETE Request
          </button>
        </form>
      </div>

    </div>
 
  );
}

export default App;
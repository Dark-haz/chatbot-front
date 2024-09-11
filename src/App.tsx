import './App.css';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

function App() {
  // initial default value to the response state that we should see when the page initally loads
  const [response, setResponse] = useState<string>(
    'Hi there! How can I assist you?'
  );
  // value will be the input written by the user
  const [value, setValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    console.log('setValue:', e.target.value);
  };

  // This function takes the contents of 'value' (the input from the user)
  // and then sends this value to our server, which then sends a new request
  // to the API
  // The function then waits for the new response and updates the 'response'
  // value which we then display on the page
  // const handleSubmit = async () => {
  //   // "i need a train, pair of socks and a pants"
  //   const body = {
  //     user_input: value,
  //     metadata: {}
  //   };

  
  //   const response = await axios.post('http://127.0.0.1:5000/product/cv', body);
  //   const data = response["data"];

  
  //   const recommendations = data["recommendations"];

  //   // const objectAsString = JSON.stringify(recommendations);

  //   console.log(response);
    

  //   const formattedString = recommendations.item
  //   .map((entry: { name: string; description: string; }) => 
  //     `<span style="color: red;">${entry.name}</span><br /><br />${entry.description}`
  //   )
  //   .join("<br /><br />");

    
  //   // const response = await axios.get('http://127.0.0.1:5000');
  //   setResponse(formattedString);
  // };

  const handleSubmit = async () => {
    // Prepare the request body
    const body = {
      user_input: value,
      metadata: {}
    };
  
    try {
      // Make the POST request
      const response = await axios.post('http://127.0.0.1:5000/product/cv', body);
      const data = response.data;
      const recommendations = data.recommendations;
  
      // Format the recommendations
      const formattedString = recommendations.item
        .map((entry: { name: string; description: string; }) => 
          `<span style="color: red;">${entry.name}</span><br /><br />${entry.description}`
        )
        .join("<br /><br />");
  
      // Set the formatted response
      setResponse(formattedString);
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
  
        if (axiosError.response) {
          // Handle 404 error specifically
          if (axiosError.response.status === 404) {
            const errorMessage = typeof axiosError.response.data === 'string'
              ? axiosError.response.data
              : JSON.stringify(axiosError.response.data);
              console.log("error message is" , errorMessage);
              
            setResponse(errorMessage);
          } else {
            // Handle other HTTP errors
            setResponse(`HTTP Error: ${axiosError.response.status}`);
          }
        } else {
          // Handle no response received or other Axios errors
          setResponse('An error occurred while making the request');
        }
      } else {
        // Handle unexpected errors
        setResponse('An unexpected error occurred');
      }
    }
  };

  return (
    <div className='container'>
      <div>
        <input type='text' value={value} onChange={onChange}></input>
      </div>
      <div>
        <button onClick={handleSubmit}>Click me for answers!</button>
      </div>
      <div>
        <p>Chatbot: 
          <br /><br />
        <span dangerouslySetInnerHTML={{ __html: response }}></span>
        </p>
      </div>
    </div>
  );
}

export default App;

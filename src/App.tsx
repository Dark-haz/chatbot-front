import './App.css';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import './App.css';

function App() {
  // initial default value to the response state that we should see when the page initally loads
  const [response, setResponse] = useState<string>(
    'Hi there! How can I assist you?'
  );
  const [loading, setLoading] = useState<boolean>(false); // New state for tracking loading

  // value will be the input written by the user
  const [value, setValue] = useState<string>('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    console.log('setValue:', e.target.value);
  };


  const handleSubmit = async () => {
    // Prepare the request body
    const body = {
      user_input: value,
      metadata: {}
    };

    setLoading(true);

    try {
      // Make the POST request
      const response = await axios.post('http://chatbot-425506931.us-east-1.elb.amazonaws.com/product/cv', body);
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
            console.log("error message is", errorMessage);

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
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className='container'>
      {/* Left Side: Input and Button */}
      <div className='input-container'>
        <input type='text' value={value} onChange={onChange} placeholder="Type your question..." />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`button ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Loading...' : 'Click me for answers!'}
        </button>
      </div>

      {/* Right Side: Chatbot Response */}
      <div className='response-container'>
        <div>
          <img src="/assets/images/bot-icon.jpg" alt="Chatbot Icon" className="chatbot-icon" />
        </div>
        <span className="chatbot-response" dangerouslySetInnerHTML={{ __html: response }}></span>
      </div>
    </div>

  );
}

export default App;

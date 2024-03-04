import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
type ChatMessage = {
  index: number
  message: {
    role: string
    content: string
  }
};
type ChatResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: ChatMessage[]
};

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<ChatResponse>();

  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await axios.post('http://localhost:3000/gpt', { prompt });
    setResponse(result.data);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {response && <Markdown rehypePlugins={[rehypeHighlight]}>{response.choices[0].message.content}</Markdown>}
    </div>
  );
}

export default App;

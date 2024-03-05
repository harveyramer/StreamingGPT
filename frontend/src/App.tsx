import  { FormEvent, useRef, useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";


function App() {
  const msg = useRef("");
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState<string>("");
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eventSource = new EventSource(
      `http://localhost:3000/gpt?prompt=${prompt}`
    );

    eventSource.onmessage = function (event) {
      const d = JSON.parse(event.data);
      if (d.message === msg.current) {
        return;
      }
      const m = `${msg.current}${d.message}`;
      console.log(m);
      msg.current = m;
      setData(m);
    };

    eventSource.onerror = function (error) {
      console.error("EventSource failed:", error);
      eventSource.close();
    };
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
      {data && <Markdown rehypePlugins={[rehypeHighlight]}>{data}</Markdown>}
    </div>
  );
}

export default App;

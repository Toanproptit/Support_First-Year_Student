import { useEffect, useState } from "react";
import axios from "axios";

export default function QnA() {
  const [questions, setQuestions] = useState([]);
  const [content, setContent] = useState("");

  const fetchData = async () => {
    const res = await axios.get("/api/questions");
    setQuestions(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAsk = async () => {
    await axios.post("/api/questions", { content });
    setContent("");
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Hỏi đáp</h1>

      <div className="flex gap-2 mb-6">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 flex-1"
        />
        <button
          onClick={handleAsk}
          className="bg-green-500 text-white px-4"
        >
          Gửi
        </button>
      </div>

      {questions.map((q) => (
        <div key={q._id} className="bg-white p-4 mb-3 rounded shadow">
          <p className="font-semibold">{q.content}</p>

          {q.answers?.map((a) => (
            <div key={a._id} className="ml-4 mt-2 border-l pl-3">
              {a.content}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
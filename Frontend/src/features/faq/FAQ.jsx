import { useEffect, useState } from "react";
import axios from "axios";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get("/api/faq").then((res) => setFaqs(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl mb-4">FAQ</h1>

      {faqs.map((f) => (
        <div key={f._id} className="bg-white p-4 mb-2">
          <h2 className="font-bold">{f.question}</h2>
          <p>{f.answer}</p>
        </div>
      ))}
    </div>
  );
}
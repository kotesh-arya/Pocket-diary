import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'

const API_URL = "http://localhost:8080/entries";

interface Entry {
  id: string;
  text: string;
  date: string;
}


function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await axios.get(API_URL);
      setEntries(response.data as Entry[]);
    };
    fetchEntries();
  }, []);

  const addEntry = async () => {
    if (!newEntry.trim()) return;
    const entry = { text: newEntry, date: new Date().toISOString() };
    const response = await axios.post(API_URL, entry);
    setEntries([response.data, ...entries]);
    setNewEntry("");
  };

  const deleteEntry = async (id: string) => {
    await axios.delete(`${API_URL}/${id}`);
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pocket Diary</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Write your entry..."
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
      ></textarea>
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onClick={addEntry}>
        Save Entry
      </button>
      <div className="mt-4">
        {entries.map((entry) => (
          <div key={entry.id} className="border p-2 rounded mb-2">
            <p>{entry.text}</p>
            <small className="text-gray-500">{new Date(entry.date).toLocaleString()}</small>
            <button className="ml-2 text-red-500" onClick={() => deleteEntry(entry.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App

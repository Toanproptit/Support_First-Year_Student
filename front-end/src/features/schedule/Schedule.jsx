import { useEffect, useState } from "react";
import axios from "axios";

export default function Schedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    axios.get("/api/schedule").then((res) => setSchedule(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-xl mb-4 font-bold">Lịch học</h1>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Thứ</th>
            <th>Phòng</th>
            <th>Thời gian</th>
          </tr>
        </thead>

        <tbody>
          {schedule.map((s) => (
            <tr key={s._id}>
              <td>{s.day}</td>
              <td>{s.room}</td>
              <td>{s.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
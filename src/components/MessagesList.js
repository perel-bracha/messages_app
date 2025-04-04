import { useEffect, useState } from "react";
import { ExportExcel } from "./ExportExcel";
import { hebrewDate } from "./Screen";

export function MessagesList() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.log(error));
  }, []);
return (
    <>
        <table>
            <thead>
                <tr>
                    <th>תאריך</th>
                    <th>תאריך יעד</th>
                    <th>מגמה</th>
                    <th>שנה</th>
                    <th>טקסט</th>
                    <th>קובץ</th>
                </tr>
            </thead>
            <tbody>
                {messages.map((message) => (
                    <tr key={message.message_id}>
                        <td>{message.message_date} {hebrewDate(message.message_date)}</td>
                        <td>{new Date(message.destination_date).toLocaleDateString()}   {hebrewDate(message.destination_date)}</td>
                        <td>{message.major_name}</td>
                        <td>{message.study_year_name}</td>
                        <td>{message.message_text}</td>
                        <td>
                            <a href={message.image_url} target="_blank" rel="noopener noreferrer">
                                {message.image_url}
                            </a>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <ExportExcel />

    </>
);
}

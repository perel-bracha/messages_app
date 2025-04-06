import { useEffect, useState } from "react";
import { ExportExcel } from "./ExportExcel";
import { hebrewDate } from "./Screen";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
export function MessagesList() {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

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
            <th></th>
            <th></th>
            <th>תאריך</th>
            <th>תאריך יעד</th>
            <th>מגמה</th>
            <th>שנה</th>
            <th>טקסט</th>
            <th>קובץ</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => {
            console.log(message);

            return (
              <tr key={message.message_id}>
                <td>
                  <button
                    className="message-buttons"
                    onClick={() => handleEdit(message, navigate)}
                  >
                    ✏️
                  </button>
                </td>
                <td>
                  <button
                    className="message-buttons"
                    onClick={() =>
                      handleDelete(message.message_id, setMessages)
                    }
                  >
                    🗑️
                  </button>
                </td>
                <td>
                  {message.message_date} {hebrewDate(message.message_date)}
                </td>
                <td>
                  {new Date(message.destination_date).toLocaleDateString()}{" "}
                  {hebrewDate(message.destination_date)}
                </td>
                <td>{message.major_name}</td>
                <td>{message.study_year_name}</td>
                <td>{message.message_text}</td>
                <td>
                  <a
                    href={message.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {message.image_url}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ExportExcel />
    </>
  );
}
function handleEdit(message, navigate) {
  navigate("/add_message", { state: { message } });

  console.log(`Edit message with ID: ${message.message_id}`);
}
async function handleDelete(messageId, setMessages) {
  const confirmation = await Swal.fire({
    title: "האם אתה בטוח?",
    text: "לא תוכל לשחזר הודעה זו לאחר המחיקה!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "כן, מחק!",
    cancelButtonText: "ביטול",
  });

  if (confirmation.isConfirmed) {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/messages/${messageId}`, {
        method: "DELETE",
      });
      console.log(response);
      
      if (!response.ok) {
        throw new Error("Failed to verify deletion");
      }
      Swal.fire("נמחק!", "ההודעה נמחקה בהצלחה.", "success");
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.message_id !== messageId)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
      Swal.fire("שגיאה!", "אירעה שגיאה בעת מחיקת ההודעה.", "error");
    }
  }
}

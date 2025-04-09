import { useEffect, useState } from "react";
import { ExportExcel } from "./ExportExcel";
import { hebrewDate } from "./Screen";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaFilter, FaTimes } from "react-icons/fa"; // ייבוא אייקונים מ-React Icons

export function MessagesList() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // מצב פתיחה/סגירה של החלונית
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    major: "",
    year: "",
    text: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
        setFilteredMessages(data); // ברירת מחדל: כל ההודעות מוצגות
      })
      .catch((error) => console.log(error));
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = messages.filter((message) => {
      const messageDate = new Date(message.destination_date);
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
      const toDate = filters.toDate ? new Date(filters.toDate) : null;

      return (
        (!fromDate || messageDate >= fromDate) &&
        (!toDate || messageDate <= toDate) &&
        (!filters.major || message.major_name.includes(filters.major)) &&
        (!filters.year || message.study_year_name.includes(filters.year)) &&
        (!filters.text || message.message_text.includes(filters.text))
      );
    });
    setFilteredMessages(filtered);
  };
  const clearFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      major: "",
      year: "",
      text: "",
    });
    setFilteredMessages(messages); // מחזיר את כל ההודעות
  };

  return (
    <div className="messages-list-container">
      <button
        className="toggle-filter-button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        title={isFilterOpen ? "סגור חלונית סינון" : "פתח חלונית סינון"}
      >
        {isFilterOpen ? <FaTimes /> : <FaFilter />}
      </button>
      <div
        className={`filter-panel ${isFilterOpen ? "open" : ""}`}
        style={{
          transform: isFilterOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <h3>סינון הודעות</h3>
        <label>
          מתאריך:
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          עד תאריך:
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          מגמה:
          <input
            type="text"
            name="major"
            value={filters.major}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          שנה:
          <input
            type="text"
            name="year"
            value={filters.year}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          טקסט:
          <input
            type="text"
            name="text"
            value={filters.text}
            onChange={handleFilterChange}
          />
        </label>
        <button onClick={applyFilters}>החל סינון</button>
        <button onClick={clearFilters}>ניקוי סינון</button>
      </div>

      <div className={`table-container ${isFilterOpen ? "shifted" : ""}`}>
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
            {filteredMessages.map((message) => (
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
            ))}
          </tbody>
        </table>
        <ExportExcel />
      </div>
    </div>
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
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/messages/${messageId}`,
        {
          method: "DELETE",
        }
      );
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

// import { useEffect, useState } from "react";
// import { ExportExcel } from "./ExportExcel";
// import { hebrewDate } from "./Screen";
// import { useNavigate } from "react-router-dom";
// export function MessagesList() {
//   const [messages, setMessages] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${process.env.REACT_APP_SERVER_URL}/messages`)
//       .then((response) => response.json())
//       .then((data) => {
//         setMessages(data);
//       })
//       .catch((error) => console.log(error));
//   }, []);
//   return (
//     <>
//       <table>
//         <thead>
//           <tr>
//             <th></th>
//             <th></th>
//             <th>תאריך</th>
//             <th>תאריך יעד</th>
//             <th>מגמה</th>
//             <th>שנה</th>
//             <th>טקסט</th>
//             <th>קובץ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {messages.map((message) => {
//             console.log(message);

//             return (
//               <tr key={message.message_id}>
//                 <td>
//                   <button
//                     className="message-buttons"
//                     onClick={() => handleEdit(message, navigate)}
//                   >
//                     ✏️
//                   </button>
//                 </td>
//                 <td>
//                   <button
//                     className="message-buttons"
//                     onClick={() =>
//                       handleDelete(message.message_id, setMessages)
//                     }
//                   >
//                     🗑️
//                   </button>
//                 </td>
//                 <td>
//                   {message.message_date} {hebrewDate(message.message_date)}
//                 </td>
//                 <td>
//                   {new Date(message.destination_date).toLocaleDateString()}{" "}
//                   {hebrewDate(message.destination_date)}
//                 </td>
//                 <td>{message.major_name}</td>
//                 <td>{message.study_year_name}</td>
//                 <td>{message.message_text}</td>
//                 <td>
//                   <a
//                     href={message.image_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     {message.image_url}
//                   </a>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//       <ExportExcel />
//     </>
//   );
// }

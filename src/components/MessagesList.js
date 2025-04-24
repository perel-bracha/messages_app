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
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [filters, setFilters] = useState({
    message_start_date: oneMonthAgo.toISOString().split("T")[0],
    message_end_date: today.toISOString().split("T")[0],
    destination_start_date: "",
    destination_end_date: "",
    major_name: "",
    study_year_name: "",
    message_text: "",
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

  const handleColumnResize = (e, columnIndex) => {
    const table = e.target.closest("table");
    const th = table.querySelectorAll("th")[columnIndex];
    const startX = e.clientX;
    const startWidth = th.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      th.style.width = `${newWidth}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    const filtered = messages.filter((message) => {
      const destinationDate = new Date(message.destination_date);
      destinationDate.setHours(0, 0, 0, 0);

      const destinationStartDate = filters.destination_start_date
        ? new Date(filters.destination_start_date)
        : null;
      if (destinationStartDate) destinationStartDate.setHours(0, 0, 0, 0);

      const destinationEndDate = filters.destination_end_date
        ? new Date(filters.destination_end_date)
        : null;
      if (destinationEndDate) destinationEndDate.setHours(0, 0, 0, 0);

      const messageDate = new Date(message.message_date);
      messageDate.setHours(0, 0, 0, 0);

      const messageStartDate = filters.message_start_date
        ? new Date(filters.message_start_date)
        : null;
      if (messageStartDate) messageStartDate.setHours(0, 0, 0, 0);

      const messageEndDate = filters.message_end_date
        ? new Date(filters.message_end_date)
        : null;
      if (messageEndDate) messageEndDate.setHours(0, 0, 0, 0);
      // console.log(messageDate, messageStartDate, messageEndDate);

      return (
        (!messageStartDate || messageDate >= messageStartDate) &&
        (!messageEndDate || messageDate <= messageEndDate) &&
        (!destinationStartDate || destinationDate >= destinationStartDate) &&
        (!destinationStartDate || destinationDate <= destinationEndDate) &&
        (!filters.major_name ||
          message.major_name.includes(filters.major_name)) &&
        (!filters.study_year_name ||
          message.study_year_name.includes(filters.study_year_name)) &&
        (!filters.message_text ||
          message.message_text.includes(filters.message_text))
      );
    });
    setFilteredMessages(filtered);
  };
  const clearFilters = () => {
    setFilters({
      message_start_date: oneMonthAgo.toISOString().split("T")[0],
      message_end_date: today.toISOString().split("T")[0],
      destination_start_date: "",
      destination_end_date: "",
      major_name: "",
      study_year_name: "",
      message_text: "",
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
        <div className="filter-date">
          <label>תאריך כתיבת ההודעה</label>
          <label>
            מתאריך:
            <input
              type="date"
              name="message_start_date"
              value={filters.message_start_date}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            עד תאריך:
            <input
              type="date"
              name="message_end_date"
              value={filters.message_end_date}
              onChange={handleFilterChange}
            />
          </label>
        </div>
        <div className="filter-date">
          <label>תאריך יעד</label>
          <label>
            מתאריך:
            <input
              type="date"
              name="destination_start_date"
              value={filters.destination_start_date}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            עד תאריך:
            <input
              type="date"
              name="destination_end_date"
              value={filters.destination_end_date}
              onChange={handleFilterChange}
            />
          </label>
        </div>
        <label>
          מגמה:
          <input
            type="text"
            name="major_name"
            value={filters.major_name}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          שנה:
          <input
            type="text"
            name="study_year_name"
            value={filters.study_year_name}
            onChange={handleFilterChange}
          />
        </label>
        <label>
          טקסט:
          <input
            type="text"
            name="message_text"
            value={filters.message_text}
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
              <th>
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 0)}
                ></div>
              </th>
              <th>
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 1)}
                ></div>
              </th>
              <th>
                תאריך
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 2)}
                ></div>
              </th>
              <th>
                תאריך יעד
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 3)}
                ></div>
              </th>
              <th>
                מגמה
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 4)}
                ></div>
              </th>
              <th>
                שנה
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 5)}
                ></div>
              </th>
              <th>
                טקסט
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 6)}
                ></div>
              </th>
              <th>
                קובץ
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 7)}
                ></div>
              </th>
              <th>
                כותבת
                <div
                  className="resize-handle"
                  onMouseDown={(e) => handleColumnResize(e, 7)}
                ></div>
              </th>
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
                      handleDelete(message.message_id, setFilteredMessages)
                    }
                  >
                    🗑️
                  </button>
                </td>
                <td>
                  {new Date(message.message_date).toLocaleDateString()}{" "}
                  {new Date(message.message_date).toLocaleTimeString()}{" "}
                  {hebrewDate(message.message_date)}
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
                <td>{message.author_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <ExportExcel filters={filters} />
      </div>
    </div>
  );
}
function handleEdit(message, navigate) {
  navigate("/add_message", { state: { message } });

  // console.log(`Edit message with ID: ${message.message_id}`, message.background_id);
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
      console.log(`${process.env.REACT_APP_SERVER_URL}/messages/${messageId}`);

      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/messages/${Number(messageId)}`,
        {
          method: "DELETE",
        }
      );
      // console.log(response);

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

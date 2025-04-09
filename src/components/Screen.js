import { HDate } from "@hebcal/core";
import { useEffect, useRef, useState } from "react";

export function Screen({ screenNum, socket }) {
  const [majors, setMajors] = useState([]);
  const [messagesByMajor, setMessagesByMajor] = useState({});
  const colors = ["#376143", "#A3B18A"]; // צבעים לסירוגין לרקע שם מגמה

  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/majors/screen/${screenNum}`)
      .then((response) => response.json())
      .then((data) => setMajors(data))
      .catch((error) => console.log(error));
  }, [screenNum]);

  useEffect(() => {
    if (majors.length > 0) {
      const fetchMessages = async () => {
        const newMessages = {};
        for (const major of majors) {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_SERVER_URL}/majors/${major.major_id}/messages/relevant`
            );
            newMessages[major.major_id] = await response.json();
          } catch (error) {
            console.log(
              `Error fetching messages for major ${major.major_id}:`,
              error
            );
          }
        }
        setMessagesByMajor(newMessages);
      };
      fetchMessages();
      socket.on("message_event", (data) => {
        console.log("Message Event Received:", data);
        fetchMessages(); // קריאה מחדש של כל ההודעות
      });
    
      
    }
  }, [socket, majors]);
  console.log(messagesByMajor, messagesByMajor[0]);

  return (
    <>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            backgroundColor: "#376143",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          דף הבית
        </button>
      </div>
      <div
        className="screen"
        style={{
          backgroundImage: `url('/wooden-fence-with-pattern-tree-bark copy 2.jpg')`,
          backgroundSize: "cover", // Ensure the image covers the container proportionally
          backgroundRepeat: "no-repeat", // Prevent repeating the image
        }}
      >
        {majors.map((major, index) => (
          <div className="major-row" key={major.major_id}>
            <div
              className="major-name"
              style={{ backgroundColor: colors[index % 2] }}
            >
              {major.major_name}
            </div>
            <div className="major-messages">
              {messagesByMajor[major.major_id]?.map((msg) =>
                msg.image_url ? (
                  <OneImage msg={msg} />
                ) : (
                  <OneMessage msg={msg} />
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
function OneImage({ msg }) {
  console.log(msg.image_url, `image`);

  return (
    <div
      className="message-card-image"
      key={msg.id}
      style={{
        backgroundImage: `url(${msg.image_url})`,
      }}
    ></div>
  );
}
function OneMessage({ msg }) {
  const textRef = useRef();
  useEffect(() => {
    const adjustFontSize = () => {
      const textElement = textRef.current;
      const parentElement = textElement.parentElement.parentElement;

      if (!textElement || !parentElement) return;

      let fontSize = parseInt(window.getComputedStyle(textElement).fontSize);

      // הקטנת גודל הגופן עד שהטקסט ייכנס בשלמותו
      while (
        (textElement.scrollWidth > parentElement.clientWidth ||
          textElement.scrollHeight > parentElement.clientHeight / 1.7) &&
        fontSize > 5 // גודל מינימלי לגופן
      ) {
        fontSize--;
        textElement.style.fontSize = `${fontSize}px`;
      }
      console.log(fontSize, `fontSize`, textElement.style.fontSize);
    };

    adjustFontSize();
    window.addEventListener("resize", adjustFontSize); // התאמה בעת שינוי גודל חלון
    return () => window.removeEventListener("resize", adjustFontSize);
  }, [msg]);
  return (
    <div className="message-card" key={msg.id}>
      <img
        src={msg.background_url}
        alt="message"
        className="message-background"
      />
      <div className="message-content">
        <div className="message-date">{hebrewDate(msg.destination_date)}</div>
        <div className="message-year">לשנה: {msg.study_year_name}</div>
        <div className="message-text" ref={textRef}>
          {msg.message_text}
        </div>
      </div>
    </div>
  );
}
export function hebrewDate(date) {
  const hDate = new HDate(new Date(date));
  const daysOfWeek = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"];
  const dayOfWeek = daysOfWeek[new Date(date).getDay()]; // קבלת היום בשבוע בעברית
  const dayAndMonth = hDate.renderGematriya().split(" ").slice(0, 2).join(" "); // קבלת היום בחודש והחודש בלבד
  return `יום ${dayOfWeek}, ${dayAndMonth}`;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function RotatingMessages({ interval = 5000, socket }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pairs, setPairs] = useState([]);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const fetchMessages = () => {
      fetch(`${process.env.REACT_APP_SERVER_URL}/majors/1/messages/relevant`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error(error));
    };
    fetchMessages();
    socket.on("message_event", (data) => {
      // console.log("Message Event Received:", data);
      fetchMessages(); // קריאה מחדש של כל ההודעות
    });
  }, [socket]);

  useEffect(() => {
    const groupedMessages = [];
    for (let i = 0; i < messages.length; i += 3) {
      if (i + 1 < messages.length) {
        groupedMessages.push([messages[i], messages[i + 1], messages[i + 2]]);
      } else {
        groupedMessages.push([messages[i]]);
      }
    }
    // console.log(groupedMessages);
    setPairs(groupedMessages);
  }, [messages]);

  const [displayedMessages, setDisplayedMessages] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % pairs.length);
    }, interval);

    return () => clearInterval(intervalId);
  }, [pairs, interval]);

  useEffect(() => {
    if (pairs.length > 0) {
      setDisplayedMessages(Object.values(pairs[currentIndex]));
    }
  }, [currentIndex, pairs]);
  const navigate = useNavigate();
  return (
    <>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button
          onClick={() => navigate("/home")}
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: "20px",
          overflow: "hidden",
        }}
      >
        {displayedMessages.map((msg, index) =>
          msg.image_url?.endsWith(".pdf") ? (
            <iframe className="message-card-pdf-clali" src={msg.image_url}></iframe>
          ) : (
            <div
              className="message-card-clali"
              key={msg.id}
              style={{
                maxHeight: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "10px", // Added padding for spacing
              }}
            >
              <img
                src={msg.image_url}
                alt={msg.title}
                style={{
                  maxHeight: "95vh",
                  maxWidth: "100%",
                  objectFit: "contain",
                  margin: "10px", // Added margin for spacing
                }}
              />
            </div>
          )
        )}
      </div>
    </>
  );
}

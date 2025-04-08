import { useEffect, useState } from "react";

export function RotatingMessages({ interval = 5000 }) {
  const [visibleIndexes, setVisibleIndexes] = useState([0, 1]);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/majors/1/messages/relevant`)
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (messages.length <= 2) return;

    const timer = setInterval(() => {
      setVisibleIndexes(([i1, i2]) => {
        let nextIndex = (i2 + 1) % messages.length;
        let second = (nextIndex + 1) % messages.length;
        return [nextIndex, second];
      });
    }, interval);

    return () => clearInterval(timer);
  }, [messages, interval]);

  const getMessagesToShow = () => {
    if (messages.length === 1) return [messages[0]];
    if (messages.length === 2) return [messages[0], messages[1]];
    return [messages[visibleIndexes[0]], messages[visibleIndexes[1]]];
  };

  const displayedMessages = getMessagesToShow();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        gap: "20px",
      }}
    >
      {displayedMessages.map((msg, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            height: "100%",
            maxWidth: messages.length === 1 ? "100%" : "50%",
            transition: "all 0.5s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
          }}
        >
          {typeof msg === "string" ? (
            <div>{msg}</div>
          ) : (
            msg
          )}
        </div>
      ))}
    </div>
  );
}

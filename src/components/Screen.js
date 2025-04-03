import { useEffect, useState } from "react";

export function Screen({ screenNum }) {
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
    }
  }, [majors]);

  return (
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
          <div className="major-name" style={{backgroundColor: colors[index % 2]}}>{major.major_name}</div>
          <div className="major-messages">
            {messagesByMajor[major.major_id]?.map((msg) => (
              <div
              className="message-card"
                key={msg.id}
                style={{                 
                  backgroundImage: `url(${msg.background_url})`,
                }}
              >
                <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {msg.study_year_name}
                </div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  {msg.message_text}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    alignSelf: "flex-end",
                  }}
                >
                  {new Date(msg.destination_date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

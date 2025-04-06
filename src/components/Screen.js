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
      className="message-card"
      key={msg.id}
      style={{
        backgroundImage: `url(${msg.image_url})`,
      }}
    >
      {/* <img src={msg.image_url} alt="message" className="message-image" /> */}
    </div>
  );
}
function OneMessage({ msg }) {
  return (
  <div
    className="message-card"
    key={msg.id}
    style={{
      backgroundImage: `url(${msg.background_url})`,
    }}
  >
    <div className="message-date">
      {hebrewDate(msg.destination_date)}
      {/* {new HDate(new Date(msg.destination_date)).renderGematriya()} */}
    </div>{" "}
    <div className="message-year">לשנה: {msg.study_year_name}</div>
    <div className="message-text">{msg.message_text}</div>
  </div>);
}
export function hebrewDate(date) {
  return new Intl.DateTimeFormat("he-IL-u-ca-hebrew", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
    .format(new Date(date))
    .replace(/\d+/g, (day) => {
      const hebrewDays = [
        "א",
        "ב",
        "ג",
        "ד",
        "ה",
        "ו",
        "ז",
        "ח",
        "ט",
        "י",
        "יא",
        "יב",
        "יג",
        "יד",
        "טו",
        "טז",
        "יז",
        "יח",
        "יט",
        "כ",
        "כא",
        "כב",
        "כג",
        "כד",
        "כה",
        "כו",
        "כז",
        "כח",
        "כט",
        "ל",
      ];
      return hebrewDays[day - 1];
    });
}

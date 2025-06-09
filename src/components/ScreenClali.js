// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

// // הגדרת ה-worker
// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
// export function RotatingMessages({major_id, interval = 8000, socket }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [pairs, setPairs] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [day, setDay] = useState(0); // מצב לשמירת היום הנוכחי

//   const lastDateRef = useRef(new Date().toDateString());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const currentDate = new Date().toDateString();
//       if (currentDate !== lastDateRef.current) {
//         lastDateRef.current = currentDate;
//         setDay((prev) => prev++);
//       }
//     }, 600 * 1000); // בדיקה כל דקה

//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     const fetchMessages = () => {
//       fetch(`${process.env.REACT_APP_SERVER_URL}/majors/${major_id}/messages/relevant`)
//         .then((response) => response.json())
//         .then((data) => setMessages(data))
//         .catch((error) => console.error(error));
//     };
//     fetchMessages();
//     socket.on("message_event", (data) => {
//       // console.log("Message Event Received:", data);
//       fetchMessages(); // קריאה מחדש של כל ההודעות
//     });
//   }, [socket, day]);

//   useEffect(() => {
//     const groupedMessages = [];
//     for (let i = 0; i < messages.length; i += 2) {
//       if (i + 1 < messages.length) {
//         groupedMessages.push([messages[i], messages[i + 1]]);
//       } else {
//         groupedMessages.push([messages[i]]);
//       }
//     }
//     // console.log(groupedMessages);
//     setPairs(groupedMessages);
//   }, [messages]);

//   const [displayedMessages, setDisplayedMessages] = useState([]);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % pairs.length);
//     }, interval);

//     return () => clearInterval(intervalId);
//   }, [pairs, interval]);

//   useEffect(() => {
//     if (pairs.length > 0) {
//       setDisplayedMessages(Object.values(pairs[currentIndex]));
//     }
//   }, [currentIndex, pairs]);
//   const navigate = useNavigate();
//   return (
//     <>
//       <div style={{ position: "absolute", top: "10px", left: "10px" }}>
//         <button
//           onClick={() => navigate("/home")}
//           style={{
//             padding: "5px 10px",
//             fontSize: "14px",
//             backgroundColor: "#376143",
//             color: "white",
//             border: "none",
//             borderRadius: "5px",
//             cursor: "pointer",
//           }}
//         >
//           דף הבית
//         </button>
//       </div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           gap: "5px",
//           overflow: "hidden",
//         }}
//       >
//         {displayedMessages.map((msg, index) => {
//           console.log(msg);

//           return (
//             <div
//               className="message-card-clali"
//               key={msg?.id}
//               style={{
//                 // maxHeight: "100%",
//                 display: "flex",
//                 flex: 1,
//                 // flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 height: "100%",
//                 padding: "9%", // Added padding for spacing
//               }}
//             >
//               {
//                 <img
//                   src={msg?.image_url || ""}
//                   alt={msg?.title}
//                   style={{
//                     height: "100%",
//                     width: "100%",
//                     objectFit: "contain",
//                   }}
//                 />
//               }
//             </div>
//           );
//         })}
//       </div>
//     </>
//   );
// }
// export default function PdfViewer({ url }) {
//   const canvasRef = useRef();

//   useEffect(() => {
//     const renderPDF = async () => {
//       const loadingTask = pdfjsLib.getDocument(url);
//       const pdf = await loadingTask.promise;
//       const page = await pdf.getPage(1);

//       const canvas = canvasRef.current;
//       const context = canvas.getContext("2d");

//       // קבלת גודל חלון המסך
//       const { innerWidth, innerHeight } = window;

//       // התאמת קנבס לגודל החלון
//       const viewport = page.getViewport({ scale: 1 });
//       const scale = Math.min(
//         innerWidth / viewport.width,
//         innerHeight / viewport.height
//       );
//       const scaledViewport = page.getViewport({ scale });

//       canvas.width = scaledViewport.width;
//       canvas.height = scaledViewport.height;

//       const renderContext = {
//         canvasContext: context,
//         viewport: scaledViewport,
//       };

//       await page.render(renderContext).promise;
//     };

//     renderPDF();
//   }, [url]);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
//     />
//   );
// }
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export function RotatingMessages({ major_id, interval = 8000, socket }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState([]);
  const [day, setDay] = useState(0); // לשינוי יומי
  const lastDateRef = useRef(new Date().toDateString());
  const navigate = useNavigate();
  // 4. הגדרת שתי אפשרויות להשהייה (במילישניות)
  const INTERVAL_OPTIONS = [20000, 10000];
  // אם רוצים להעביר מה־props, אפשר לקרוא כאן props כמו defaultInterval, ולקבוע את הערך ההתחלתי בהתאם אליו.
  const [intervalValue, setIntervalValue] = useState(20000);
  // מצב התצוגה: 'single' או 'pair'
  const [displayMode, setDisplayMode] = useState("single");

  // 1. בדיקה יומית לשינוי day
  useEffect(() => {
    const dateChecker = setInterval(() => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastDateRef.current) {
        lastDateRef.current = currentDate;
        setDay((prev) => prev + 1);
      }
    }, 60 * 1000); // כל דקה

    return () => clearInterval(dateChecker);
  }, []);

  // 2. טעינת ההודעות וחידוש על אירוע socket
  useEffect(() => {
    const fetchMessages = () => {
      fetch(
        `${process.env.REACT_APP_SERVER_URL}/majors/${major_id}/messages/relevant`
      )
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((err) => console.error(err));
    };
    fetchMessages();

    socket.on("message_event", () => {
      fetchMessages();
    });

    return () => {
      socket.off("message_event");
    };
  }, [socket, day, major_id]);

  // 3. יצירת מערך זוגות (למצב 'pair')
  const pairs = useRef([]);
  useEffect(() => {
    const grouped = [];
    for (let i = 0; i < messages.length; i += 2) {
      if (i + 1 < messages.length) {
        grouped.push([messages[i], messages[i + 1]]);
      } else {
        grouped.push([messages[i]]);
      }
    }
    pairs.current = grouped;
  }, [messages]);

  // 4. קרונומטר לסיבוב, לפי סוג המצב
  useEffect(() => {
    if (displayMode === "single") {
      if (messages.length === 0) return;
      const rotate = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
      }, intervalValue);
      return () => clearInterval(rotate);
    } else {
      if (pairs.current.length === 0) return;
      const rotate = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % pairs.current.length);
      }, interval);
      return () => clearInterval(rotate);
    }
  }, [displayMode, messages, intervalValue]);

  // 5. השגת הנתונים להצגה בהתאם למצב
  let itemsToDisplay = [];
  if (displayMode === "single") {
    const msg = messages[currentIndex];
    if (msg) itemsToDisplay = [msg];
  } else {
    const pair = pairs.current[currentIndex];
    if (pair) itemsToDisplay = pair;
  }
  const toggleInterval = () => {
    // מוצאים את האינדקס הנוכחי של intervalValue במערך OPTIONS
    const currentIdx = INTERVAL_OPTIONS.indexOf(intervalValue);
    // אם לא נמצא (לדוגמה הערך נשלח מ־props ולא בתיבה), כדאי לקבוע ברירת מחדל
    const nextIdx =
      currentIdx === -1 ? 0 : (currentIdx + 1) % INTERVAL_OPTIONS.length;
    setIntervalValue(INTERVAL_OPTIONS[nextIdx]);
  };
  return (
    <>
      {/* כפתור חזרה ודילוג בין מצבי תצוגה */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          onClick={toggleInterval}
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            backgroundColor: "#555",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >{intervalValue === INTERVAL_OPTIONS[0]
    ? `${INTERVAL_OPTIONS[1] / 1000} שניות`
    : `${INTERVAL_OPTIONS[0] / 1000} שניות`}</button>
        <button
          onClick={() =>
            setDisplayMode((prev) => (prev === "single" ? "pair" : "single"))
          }
          style={{
            padding: "5px 10px",
            fontSize: "14px",
            backgroundColor: "#888",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {displayMode === "single" ? "מצב זוגות" : "מצב יחיד"}
        </button>
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

      {/* תצוגת ההודעות */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          gap: "5px",
          overflow: "hidden",
        }}
      >
        {itemsToDisplay.map((msg) => (
          <div
            className="message-card-clali"
            key={msg.id}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              padding: "9%",
            }}
          >
            <img
              src={msg.image_url || ""}
              alt={msg.title}
              style={{
                height: "100%",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default RotatingMessages;

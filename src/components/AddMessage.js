import { useState, useEffect } from "react";
import {
  BackgroundSelector,
  DateInput,
  DragAndDropFileInput,
  SelectInput,
  TextAreaInput,
} from "./Inputs";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

// פונקציה לעיצוב התאריך לפורמט YYYY-MM-DD
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Main AddMessage component
const AddMessage = () => {
  const location = useLocation();
  const existingMessage = location.state?.message; // אם לא יישלח message, הערך יהיה undefined
  // console.log(existingMessage, "existingMessage");

  const [formData, setFormData] = useState({
    destination_date: formatDate(new Date()), // תאריך ברירת מחדל: היום
    major_id: 1,
    study_year_id: 1,
    message_text: "",
    image_path: null,
    background_id: "3",
  });
  const [majors, setMajors] = useState([]); // מצב לשמירת המגמות
  const [years, setYears] = useState([]); // מצב לשמירת השנים
  const [backgrounds, setBackgrounds] = useState([]); // מצב לשמירת הרקעים
  useEffect(() => {
    if (existingMessage) {
      setFormData({
        destination_date: existingMessage.destination_date
          ? formatDate(new Date(existingMessage.destination_date))
          : formatDate(new Date()),
        major_id: existingMessage.major_id || 1,
        study_year_id: existingMessage.study_year_id || 1,
        message_text: existingMessage.message_text || "",
        image_path: null, // File inputs cannot be pre-filled
        background_id: JSON.stringify(existingMessage.background_id) || "1",
      });
    }
  }, [existingMessage]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/majors`)
      .then((response) => response.json())
      .then((data) => {
        setMajors(data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/study_years`)
      .then((response) =>
        response.json().then((data) => {
          setYears(data);
        })
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/backgrounds`)
      .then((response) =>
        response.json().then((data) => {
          setBackgrounds(data);
        })
      )
      .catch((error) => console.log(error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name == "study_year_id") {
      if (value == 3) setFormData((prev) => ({ ...prev, background_id: "2" }));
      else if (value == 2)
        setFormData((prev) => ({ ...prev, background_id: "3" }));
      else if (value == 4 || value == 1)
        setFormData((prev) => ({ ...prev, background_id: "1" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_path: file, background_id: "0" }); // שמירת הקובץ במקום ה-URL
    }
  };

  const handleBackgroundChange = (e) => {
    setFormData({ ...formData, background_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.major_id !== 1 && formData.message_text.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "שגיאה",
        text: "יש להזין טקסט בהודעה.",
        confirmButtonText: "אישור",
      });
      return;
    }
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image_path" && value)
        formDataToSend.append(key, value, value.name); // הוספת הקובץ עם השם המקורי
    });

    // console.log(formDataToSend);

    const url = existingMessage
      ? `${process.env.REACT_APP_SERVER_URL}/messages/${existingMessage.message_id}`
      : `${process.env.REACT_APP_SERVER_URL}/messages`;

    const method = existingMessage ? "PUT" : "POST";
    const transformedFormData = {
      destination_date: formData.destination_date,
      major_id: parseInt(formData.major_id, 10),
      study_year_id: parseInt(formData.study_year_id, 10),
      message_text: formData.message_text,
      image_path: formData.image_path
        ? `/public/images/${formData.image_path.name}`
        : null,
      background_id: formData.background_id
        ? parseInt(formData.background_id, 10)
        : null,
    };

    // console.log(JSON.stringify(transformedFormData));
    if (formData.image_path) {
      const uploadResponse = await fetch(`${url}/upload_image`, {
        method: method,
        body: formDataToSend,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload the image");
      }

      const uploadResult = await uploadResponse.json();
      transformedFormData.image_path = uploadResult.filePath; // Update the image_path with the file path from the server
      // console.log(`uploading image to ${url}/upload_image`);
    }
    fetch(url, {
      method: method,
      body: JSON.stringify(transformedFormData),
      headers: {
        "Content-Type": "application/json", // חשוב מאוד לציין את ה-Content-Type
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save the message");
        }
        return response.json();
      })
      .then((data) => {
        Swal.fire({
          icon: "success",
          title: existingMessage
            ? "ההודעה עודכנה בהצלחה!"
            : "ההודעה נוספה בהצלחה!",
          text: existingMessage
            ? "ההודעה עודכנה בלוח המודעות הדיגיטלי."
            : "הוספנו את ההודעה ללוח המודעות הדיגיטלי.",
          confirmButtonText: "אישור",
        }).then(() =>
          setFormData({
            destination_date: formatDate(new Date()),
            major_id: 1,
            study_year_id: 1,
            message_text: "",
            image_path: null,
            background_id: "3",
          })
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "אירעה שגיאה!",
          text: existingMessage
            ? "לא הצלחנו לעדכן את ההודעה. נסה שוב."
            : "לא הצלחנו להוסיף את ההודעה. נסה שוב.",
          confirmButtonText: "אישור",
        });
      });
  };

  return (
    <>
      {/* <h1>הוספת הודעה</h1> */}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="major-year-input">
          <DateInput
            label="עד תאריך"
            name="destination_date"
            value={formData.destination_date}
            onChange={handleChange}
            required
          />
          <div className="selects">
            <SelectInput
              label="מגמה"
              name="major_id"
              value={formData.major_id}
              onChange={handleChange}
              options={majors.map((major) => ({
                value: major.major_id,
                label: major.major_name,
              }))}
              required
            />
            <SelectInput
              label="שנה"
              name="study_year_id"
              value={formData.study_year_id}
              onChange={handleChange}
              options={years.map((year) => ({
                value: year.study_year_id,
                label: year.study_year_name,
              }))}
              required
            />
          </div>
        </div>

        <div className="message-input">
          <TextAreaInput
            label="גוף ההודעה"
            name="message_text"
            value={formData.message_text}
            onChange={handleChange}
          />
        </div>
        <div className="background-selector">
          <BackgroundSelector
            label="רקע"
            name="background_id"
            value={formData.background_id}
            onChange={handleBackgroundChange}
            backgrounds={backgrounds}
          />
        </div>
        <div className="file-input">
          <DragAndDropFileInput
            label="העלאת תמונה"
            name="image_path"
            onChange={handleFileChange}
          />
        </div>
        <div className="submit-button">
          <button type="submit">{existingMessage ? "עדכון" : "שמור"}</button>
        </div>
      </form>
    </>
  );
};

export default AddMessage;

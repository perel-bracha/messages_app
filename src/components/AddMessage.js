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
  console.log(existingMessage, "existingMessage");

  const [formData, setFormData] = useState({
    destination_date: formatDate(new Date()), // תאריך ברירת מחדל: היום
    major_id: 1,
    study_year_id: 1,
    message_text: "",
    image_path: null,
    background_id: 1,
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
        background_id: existingMessage.background_id || "",
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
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_path: file }); // שמירת הקובץ במקום ה-URL
    }
  };

  const handleBackgroundChange = (e) => {
    setFormData({ ...formData, background_id: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image_path" && value)
        formDataToSend.append(key, value, value.name); // הוספת הקובץ עם השם המקורי
    });

    console.log(formDataToSend);

    const url = existingMessage
      ? `${process.env.REACT_APP_SERVER_URL}/messages/${existingMessage.id}`
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

    console.log(JSON.stringify(transformedFormData));
    if (formData.image_path) {
      await fetch(`${url}/upload_image`, {
        method: method,
        body: formDataToSend,
      });
      console.log(`uploading image to ${url}/upload_image`);
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
          title: "!ההודעה נוספה בהצלחה",
          text: "הוספנו את ההודעה ללוח המודעות הדיגיטלי", //מידע מפורט
          confirmButtonText: "אישור",
        }).then(() =>
          setFormData({
            destination_date: formatDate(new Date()),
            major_id: 1,
            study_year_id: 1,
            message_text: "",
            image_path: null,
            background_id: 1,
          })
        );
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "!אירעה שגיאה",
          text: ".לא הצלחנו להוסיף את ההודעה. נסה שוב",
          confirmButtonText: "אישור",
        });
      });
  };

  return (
    <>
      <h1>הוספת הודעה</h1>
      <form onSubmit={handleSubmit}>
        <DateInput
          label="ליום"
          name="destination_date"
          value={formData.destination_date}
          onChange={handleChange}
          required
        />
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
        <TextAreaInput
          label="גוף ההודעה"
          name="message_text"
          value={formData.message_text}
          onChange={handleChange}
        />
        {/* באיזה קבצים תומך */}

        <BackgroundSelector
          label="רקע"
          name="background_id"
          value={formData.background_id}
          onChange={handleBackgroundChange}
          backgrounds={backgrounds}
        />
        <DragAndDropFileInput
          label="העלאת תמונה"
          name="image_path"
          onChange={handleFileChange}
        />
        <button type="submit">{existingMessage ? "עדכון" : "שמור"}</button>
      </form>
    </>
  );
};

export default AddMessage;

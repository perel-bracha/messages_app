import React, { useState } from "react";
import { hebrewDate } from "./Screen";

export const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => (
  <div style={{ maxWidth: "100%" }}>
    <textarea
      placeholder="הקלידי כאן את ההודעה"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      rows="8"
      style={{
        fontSize: "20px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        border: "2px solid #376143",
      }}
    />
  </div>
);

// Subcomponent for date input
export const DateInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="date-input">
      
      <label className="myLabel">{label}: </label>

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
      {value && <p className="hebrewLabel">תאריך עברי: {hebrewDate(value)}</p>}
    </div>
  );
};

// Subcomponent for select dropdown
export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => (
  <div className="select-input-box">
    <div className="myLabel">
    <label>{label}:</label>
    <select name={name} value={value} onChange={onChange} required={required}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div></div>
);

export const DragAndDropFileInput = ({ label, name, onChange }) => {
  const [selectedFile, setSelectedFile] = useState(null); // מצב לשמירת הקובץ שנבחר
  const [previewUrl, setPreviewUrl] = useState(null); // מצב לשמירת כתובת התצוגה המקדימה

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file); // שמירת הקובץ שנבחר
    onChange({ target: { name, files: [file] } }); // קריאה לפונקציית onChange שהועברה כפרופס

    // יצירת תצוגה מקדימה אם מדובר בקובץ תמונה
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null); // איפוס התצוגה המקדימה אם זה לא תמונה
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  return (
    <div
      className="drag-and-drop"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        border: "2px dashed gray",
        borderRadius: "5px",
        padding: "20px",
        textAlign: "center",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      {!selectedFile ? (
        <>
          <p>{label}</p>
          <p>ניתן לגרור לכאן תמונה עם ההודעה במקום לבחור רקע וטקסט</p>
        </>
      ) : (
        <p>גרור תמונה כדי להחליף את התמונה שנבחרה</p>
      )}

      <input
        type="file"
        name={name}
        onChange={handleInputChange}
        style={{ display: "none", textAlign: "center" }}
        id={`file-input-${name}`}
      />
      <label
        htmlFor={`file-input-${name}`}
        style={{
          cursor: "pointer",
          color: "#376143",
          textAlign: "center",
          display: "block",
        }}
      >
        סייר הקבצים
      </label>

      {/* הצגת שם הקובץ שנבחר */}
      {selectedFile && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>Selected File: {selectedFile.name}</p>
          {/* הצגת תצוגה מקדימה אם מדובר בתמונה */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                border: "2px solid green",
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

// Modified BackgroundSelector to set the initial value
export const BackgroundSelector = ({
  label,
  name,
  value,
  onChange,
  backgrounds,
}) => {
  // Set the initial value if not already set
  if (!value && backgrounds.length > 0) {
    onChange({ target: { name, value: String(backgrounds[0].background_id) } });
  }

  return (
    <div className="background-selector">
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          alignSelf: "center",
        }}
      >
        {backgrounds.map((background) => (
          <div key={background.background_id} style={{ textAlign: "center" }}>
            <input
              type="radio"
              id={`background-${background.background_id}`}
              name={name}
              value={background.background_id} // השתמש ב-background_id כערך
              checked={value === String(background.background_id)} // בדוק אם הערך תואם
              onChange={onChange}
              style={{ display: "none" }} // הסתר את תיבת הסימון
            />
            <label htmlFor={`background-${background.background_id}`}>
              <img
                src={background.background_url}
                alt={background.background_name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  border:
                    value === String(background.background_id)
                      ? "3px solid #376143"
                      : "0px solid",
                  borderRadius: "5px",
                }}
              />
            </label>
            <div>{background.background_name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { HDate } from "@hebcal/core";
import { hebrewDate } from "./Screen";


export const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label>
      {label}:
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows="10"
        cols="50"
      />
    </label>
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
    const formatHebrewDate = (date) => {
    const hDate = new HDate(new Date(date));
    const daysOfWeek = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "שבת"];
    const dayOfWeek = daysOfWeek[new Date(date).getDay()]; // קבלת היום בשבוע בעברית
    return `${dayOfWeek} ${hDate.renderGematriya()}`;
  };
  // const hebrewDate = value ? new HDate(new Date(value)).renderGematriya() : "";
// const hebrewDate = value ? formatHebrewDate(value) : "";
  return (
    <div>
      <label>
        {label}:
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
      </label>
      {value && (
        <p className="hebrewLabel" >
          תאריך עברי: {hebrewDate(value)}
        </p>
      )}
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
  <div>
    <label>
      {label}:
      <select name={name} value={value} onChange={onChange} required={required} plac>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  </div>
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
      }}
    >
      {/* טקסט דינמי בהתאם למצב */}
      {!selectedFile ? (
        <>
          <p>{label}</p>
          <p>Drag and drop a file here, or click to select one</p>
        </>
      ) : (
        <p>Drag and drop a new file to replace the current one</p>
      )}

      <input
        type="file"
        name={name}
        onChange={handleInputChange}
        style={{ display: "none" }}
        id={`file-input-${name}`}
      />
      <label
        htmlFor={`file-input-${name}`}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Browse Files
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
export const BackgroundSelector = ({ label, name, value, onChange, backgrounds }) => {
    // Set the initial value if not already set
    if (!value && backgrounds.length > 0) {
        onChange({ target: { name, value: String(backgrounds[0].background_id) } });
    }

    return (
        <div className="background-selector">
            <label>{label}:</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {backgrounds.map((background) => (
                    <div key={background.background_id} style={{ textAlign: "center" }}>
                        <input
                            type="radio"
                            id={`background-${background.background_id}`}
                            name={name}
                            value={background.background_id} // השתמש ב-background_id כערך
                            checked={value === String(background.background_id)} // בדוק אם הערך תואם
                            onChange={onChange}
                        />
                        <label htmlFor={`background-${background.background_id}`}>
                            <img
                                src={background.background_url}
                                alt={background.background_name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    border: value === String(background.background_id) ? "2px solid blue" : "1px solid gray",
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
// export const BackgroundSelector = ({ label, name, value, onChange, backgrounds }) => {
//     return (
//         <div className="background-selector">
//             <label>{label}:</label>
//             <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
//                 {backgrounds.map((background) => (
//                     <div key={background.background_id} style={{ textAlign: "center" }}>
//                         <input
//                             type="radio"
//                             id={`background-${background.background_id}`}
//                             name={name}
//                             value={background.background_id} // השתמש ב-background_id כערך
//                             checked={value === String(background.background_id)} // בדוק אם הערך תואם
//                             onChange={onChange}
//                         />
//                         <label htmlFor={`background-${background.background_id}`}>
//                             <img
//                                 src={background.background_url}
//                                 alt={background.background_name}
//                                 style={{
//                                     width: "100px",
//                                     height: "100px",
//                                     objectFit: "cover",
//                                     border: value === String(background.background_id) ? "2px solid blue" : "1px solid gray",
//                                     borderRadius: "5px",
//                                 }}
//                             />
//                         </label>
//                         <div>{background.background_name}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };
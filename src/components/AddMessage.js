import React, { useState, useEffect } from "react";

// Subcomponent for text input
const TextAreaInput = ({ label, name, value, onChange, required = false }) => (
    <div>
        <label>
            {label}:
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                rows="4"
                cols="50"
            />
        </label>
    </div>
);


// Subcomponent for date input
const DateInput = ({ label, name, value, onChange, required = false }) => (
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
    </div>
);

// Subcomponent for file input
const DragAndDropFileInput = ({ label, name, onChange }) => {
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            onChange({ target: { name, files: [file] } });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div
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
            <p>{label}</p>
            <p>Drag and drop a file here, or click to select one</p>
            <input
                type="file"
                name={name}
                onChange={onChange}
                style={{ display: "none" }}
                id={`file-input-${name}`}
            />
            <label htmlFor={`file-input-${name}`} style={{ cursor: "pointer", color: "blue" }}>
                Browse Files
            </label>
        </div>
    );
};

// Subcomponent for select dropdown
const SelectInput = ({ label, name, value, onChange, options, required = false }) => (
    <div>
        <label>
            {label}:
            <select name={name} value={value} onChange={onChange} required={required}>
                <option value="">Select...</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </label>
    </div>
);

const BackgroundSelector = ({ label, name, value, onChange }) => {
    const [backgrounds, setBackgrounds] = useState([]);

    useEffect(() => {
        // Fetch backgrounds from the server
        fetch("/api/backgrounds")
            .then((response) => response.json())
            .then((data) => setBackgrounds(data))
            .catch((error) => console.error("Error fetching backgrounds:", error));
    }, []);

    return (
        <div>
            <label>{label}:</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {backgrounds.map((background) => (
                    <div key={background.id} style={{ textAlign: "center" }}>
                        <input
                            type="radio"
                            id={`background-${background.id}`}
                            name={name}
                            value={background.id}
                            checked={value === String(background.id)}
                            onChange={onChange}
                        />
                        <label htmlFor={`background-${background.id}`}>
                            <img
                                src={background.imageUrl}
                                alt={background.name}
                                style={{
                                    width: "100px",
                                    height: "100px",
                                    objectFit: "cover",
                                    border: value === String(background.id) ? "2px solid blue" : "1px solid gray",
                                    borderRadius: "5px",
                                }}
                            />
                        </label>
                        <div>{background.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main AddMessage component
const AddMessage = ({ existingMessage = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        destination_date: "",
        major_id: "",
        study_year_id: "",
        message_text: "",
        image_path: null,
        background_id: "",
    });

    useEffect(() => {
        if (existingMessage) {
            setFormData({
                destination_date: existingMessage.destination_date || "",
                major_id: existingMessage.major_id || "",
                study_year_id: existingMessage.study_year_id || "",
                message_text: existingMessage.message_text || "",
                image_path: null, // File inputs cannot be pre-filled
                background_id: existingMessage.background_id || "",
            });
        }
    }, [existingMessage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image_path: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <DateInput
                label="Destination Date"
                name="destination_date"
                value={formData.destination_date}
                onChange={handleChange}
                required
            />
            <SelectInput
                label="Major"
                name="major_id"
                value={formData.major_id}
                onChange={handleChange}
                options={[
                    { value: 1, label: "Major 1" },
                    { value: 2, label: "Major 2" },
                ]}
                required
            />
            <SelectInput
                label="Study Year"
                name="study_year_id"
                value={formData.study_year_id}
                onChange={handleChange}
                options={[
                    { value: 1, label: "Year 1" },
                    { value: 2, label: "Year 2" },
                ]}
                required
            />
            <TextAreaInput
                label="Message Text"
                name="message_text"
                value={formData.message_text}
                onChange={handleChange}
            />
            <DragAndDropFileInput
                label="Upload Image"
                name="image_path"
                onChange={handleFileChange}
            />
            <BackgroundSelector
                label="Background"
                name="background_id"
                value={formData.background_id}
                onChange={handleChange}
            />
            <button type="submit">{existingMessage ? "Update Message" : "Add Message"}</button>
        </form>
    );
};

export default AddMessage;
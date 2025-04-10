export function ExportExcel({filters}) {
  const handleExport = async () => {
    const queryString = new URLSearchParams(filters).toString();
    console.log(`Exporting with filters: ${queryString}`); // Debugging line
    
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/messages/export?${queryString}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to download Excel file");
      }

      const blob = await response.blob();

      // יצירת URL זמני להורדת הקובץ
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "messages.xlsx"); // שם הקובץ שיורד
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download Excel file:", error);
    }
  };

  return (
    <div>
      <button className="export-excel-button" onClick={handleExport}>
        ייצוא לאקסל
      </button>
    </div>
  );
}
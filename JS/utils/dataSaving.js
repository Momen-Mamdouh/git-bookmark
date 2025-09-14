export const exportTable = (table, allData, format = "csv", filename = "table-data") => {
  if (!allData || allData.length === 0) return;

  // Prefer headers from table, but fall back to object keys
  let headers = [];
  if (table) {
    const headerCols = table.querySelectorAll("thead th");
    headers = [...headerCols].map(col => col.innerText.trim());
  }
  if (headers.length === 0) {
    headers = Object.keys(allData[0]);
  }

  let blob, fileExtension;

  switch (format.toLowerCase()) {
    case "json":
      blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
      fileExtension = "json";
      break;

    case "txt":
      blob = new Blob(
        [allData.map(row => headers.map(h => row[h]).join(" | ")).join("\n")],
        { type: "text/plain" }
      );
      fileExtension = "txt";
      break;

    case "csv":
    default:
      const csv = [
        headers.join(","), // header row
        ...allData.map(row =>
          headers.map(h => `"${row[h] ?? ""}"`).join(",")
        ),
      ];
      blob = new Blob([csv.join("\n")], { type: "text/csv" });
      fileExtension = "csv";
  }

  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${fileExtension}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

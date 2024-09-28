import React, { useRef, useState } from "react";
import { MdFileUpload } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import * as XLSX from "xlsx";
import sampleRecords from "./sample_records";
import { BiSolidError } from "react-icons/bi";
import DialogBox from "./Dialog"; // Import the DialogBox component
import { IoMdInformationCircleOutline } from "react-icons/io";

function Home() {
  const fileInput = useRef(null);
  const [rpoChecked, setRpoChecked] = useState(true);
  const [bdcChecked, setBdcChecked] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    icon: null,
    title: "",
    message: ""
  })

  // Handler for input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handler for adding the security
  const handleAddClick = () => {
    const security = sampleRecords.find((record) => record.id === inputValue);
    if (security) {
      setRows([...rows, security]);
    } else {
        setDialogContent({
            icon: <BiSolidError className="w-10 h-10 text-red-500" />,
            title: "Error",
            message: "No record found with this ID."
        })
        setShowDialog(true);
    }
  };

  const handleSend = (event) => {
    setDialogContent({
        icon: <IoMdInformationCircleOutline className="w-10 h-10 text-green-500" />,
        title: "ISM Message sent!",
        message: "ISM Message with selected securities successfully sent!"
      })
      setShowDialog(true);
  }

  // Handler for file upload and parsing
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;

      let securityIds = [];
      if (file.type === "text/csv" || file.type === "text/plain") {
        // Parse CSV or plain text file
        const regex = /[\n,|]+/; // Newline, comma, or pipe separator
        securityIds = fileData.split(regex).filter(Boolean);
      } else if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel"
      ) {
        // Parse XLSX file
        const workbook = XLSX.read(fileData, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_csv(firstSheet);
        const regex = /[\n,|]+/;
        securityIds = sheetData.split(regex).filter(Boolean);
      }

      const newRows = securityIds
        .map((id) => sampleRecords.find((record) => record.id === id))
        .filter(Boolean);

      if (newRows.length > 0) {
        setRows([...rows, ...newRows]);
      } else {
        setShowDialog(true);
      }
    };

    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel") {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Handler for removing the selected rows
  const handleRemoveClick = () => {
    setRows(rows.filter((row) => !selectedRows.includes(row.id)));
    setSelectedRows([]); // Clear selection after removal
  };

  // Handler for downloading the current data as CSV
  const handleDownloadCSV = () => {
    const headers = [
      "Security ID",
      "Security ID Type",
      "Universe Code",
      "Unified Security Type",
      "Global Security Type",
      "Issue Date",
      "Price",
      "Price Effective Date",
      "SMD Price",
      "Price Currency",
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        [
          row.id,
          row.securityIDType,
          row.universeCode,
          row.unifiedSecType,
          row.globalSecType,
          row.issueDate,
          row.price,
          row.priceEffectiveDate,
          row.smdPrice,
          row.priceCurrency,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "security_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    { field: "id", headerName: "Security ID", width: 120 },
    { field: "securityIDType", headerName: "Security ID Type", width: 130 },
    { field: "universeCode", headerName: "Universe Code", width: 130 },
    {
      field: "unifiedSecType",
      headerName: "Unified Security Type",
      width: 180,
    },
    { field: "globalSecType", headerName: "Global Security Type", width: 168 },
    { field: "issueDate", headerName: "Issue Date", width: 100 },
    { field: "price", headerName: "Price", width: 100 },
    {
      field: "priceEffectiveDate",
      headerName: "Price Effective Date",
      width: 170,
    },
    { field: "smdPrice", headerName: "SMD Price", width: 130 },
    { field: "priceCurrency", headerName: "Price Currency", width: 130 },
  ];

  const paginationModel = { page: 0, pageSize: 20 };

  return (
    <div className="bg-[#000000] h-full py-8 px-4 montserrat text-white">
      <div className="flex gap-x-8">
        <div className="flex gap-x-4">
          <input
            className="bg-[#1c1f24] w- focus:outline-none p-1 text-base focus:caret-transparent"
            value={inputValue}
            onChange={handleInputChange}
            maxLength={6}
          />
          <button
            onClick={handleAddClick}
            disabled={inputValue.length !== 6}
            className="bg-[#1c1f24] text-white text-xs p-2"
          >
            ADD
          </button>
        </div>

        <div className="border border-x"></div>

        <div className="flex gap-x-4">
          <input
            className="bg-[#1c1f24] w-36 focus:outline-none p-1 text-base focus:caret-transparent"
            disabled
          />
          <input
            ref={fileInput}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .csv, .txt"
          />
          <button
            onClick={() => {
              fileInput.current.click();
            }}
            className="bg-[#1c1f24] border text-xs p-2 flex gap-x-1"
          >
            <MdFileUpload size={16} />
            SELECT FILE
          </button>
        </div>

        <div className="border border-x"></div>

        <div className="flex items-center gap-x-4 text-sm">
          Destination
          <input
            type="checkbox"
            defaultChecked={rpoChecked}
            onChange={() => {
              setRpoChecked(!rpoChecked);
            }}
            name=""
            id=""
          />
          <label htmlFor="">RPO</label>
          {rpoChecked && (
            <select className="bg-[#1c1f24] p-1 border text-xs">
              <option value="0">DOM</option>
              <option value="1">GLO</option>
              <option value="2">BOTH</option>
            </select>
          )}
          <input
            type="checkbox"
            defaultChecked={bdcChecked}
            onChange={() => {
              setBdcChecked(!bdcChecked);
            }}
            name=""
            id=""
          />
          <label htmlFor="">BDC</label>
          {bdcChecked && (
            <select className="bg-[#1c1f24] p-1 border text-xs">
              <option value="0">UPDATE</option>
              <option value="1">1PM</option>
            </select>
          )}
        </div>

        <div className="border border-x"></div>

        <div className="flex gap-x-4 justify-end w-auto items-center">
          <button onClick={handleDownloadCSV} className="text-xs bg-[#14697e] p-2 text-white flex gap-x-2 items-center">
            <IoMdDownload /> CSV
          </button>
          <button
            className="text-xs bg-[#14697e] p-2 text-white"
            onClick={handleRemoveClick}
            disabled={selectedRows.length === 0} // Disable if no rows are selected
          >
            REMOVE
          </button>
          <button onClick={handleSend} className="text-xs bg-[#14697e] p-2 text-white">SEND</button>
        </div>
      </div>

      <div className="pt-8 font-light montserrat">
        <Paper sx={{ height: 550, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection); // Update selected rows
            }}
            rowSelectionModel={selectedRows}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20]}
            sx={{
              border: 0,
              fontWeight: 400,
              background: "#1c1f24",
              color: "white",
              "& .css-wop1k0-MuiDataGrid-footerContainer": { border: 0 },
              ".MuiDataGrid-columnHeader": {
                border: 0,
                borderBottom: "0!important",
                fontWeight: 400,
              },
              ".MuiTablePagination-root": { color: "white" },
              "& .css-1w53k9d-MuiDataGrid-overlay": { background: "#1c1f24" },
              ".MuiDataGrid-row--borderBottom": {
                background: "#1c1f24!important",
              },
              "& .css-1jlz3st": {
                border: 0,
              },
              ".MuiDataGrid-cell": {
                border: 0,
              },
            }}
          />
        </Paper>
      </div>

      {/* Dialog Box */}
      {showDialog && (
        <DialogBox
          icon={dialogContent.icon}
          title={dialogContent.title}
          message={dialogContent.message}
          onClose={() => setShowDialog(false)}
        />
      )}
    </div>
  );
}

export default Home;

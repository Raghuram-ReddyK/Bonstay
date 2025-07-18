import { Button } from '@mui/material';
import { FileDownload as ExportIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Reusable Excel Export Component
 * This component provides a customizable button that, when clicked, exports provided data
 * into an Excel (.xlsx) file. It supports custom headers, data transformation,
 * dynamic filename generation, and auto-sizing of columns.
 * * @param {Object} props - The props for the ExcelExport component.
 * @param {Array<Object>} props.data - An array of objects to be exported. Each object represents a row.
 * @param {Array<Object>} props.headers - An array of header configurations. Each object should have:
 * - `key` (string): The key in the `data` object corresponding to this column's value.
 * - `label` (string): The display name for the column header in Excel.
 * - `transform` (function, optional): A function `(value, item) => transformedValue` to modify the value before export.
 * @param {string} [props.filename='Export'] - The base filename for the exported Excel file (without extension). A timestamp will be appended.
 * @param {string} [props.sheetName='Sheet1'] - The name of the sheet within the Excel workbook.
 * @param {string} [props.buttonText='Export to Excel'] - The text to display on the export button.
 * @param {string} [props.variant='outlined'] - The Material-UI Button variant (e.g., 'outlined', 'contained', 'text').
 * @param {string} [props.color='primary'] - The Material-UI Button color (e.g., 'primary', 'secondary', 'error').
 * @param {object} [props.buttonProps={}] - Additional props to pass directly to the Material-UI Button component.
 * @param {function} [props.onExport=null] - Optional callback function `({ filename, recordCount, timestamp }) => void`
 * called after a successful export, providing details about the export operation.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled. It's also disabled if `data` is empty.
 * @param {string} [props.size='medium'] - The Material-UI Button size (e.g., 'small', 'medium', 'large').
 */
const ExcelExport = ({
    data = [], // Default to an empty array if no data is provided
    headers = [], // Default to an empty array if no headers are provided
    filename = 'Export',
    sheetName = 'Sheet1',
    buttonText = 'Export to Excel',
    variant = 'outlined',
    color = 'primary',
    buttonProps = {},
    onExport = null,
    disabled = false,
    size = 'small'
}) => {
    /**
     * Handles the export process when the button is clicked.
     * It performs data transformation, creates the Excel workbook,
     * auto-sizes columns, and triggers the file download.
     */
    const handleExport = () => {
        // Step 1: Validate data
        // If no data or an empty array is provided, show an alert and stop the export.
        if (!data || data.length === 0) {
            // Using alert() for simplicity, consider a more user-friendly modal in a production app.
            alert('No data available to export');
            return;
        }

        try {
            // Step 2: Transform data based on headers configuration
            // Iterate over each item (row) in the input `data` array.
            const exportData = data.map(item => {
                const transformedItem = {}; // Initialize an empty object for the transformed row.

                // For each header configuration, extract the relevant value from the current item.
                headers.forEach(header => {
                    const { key, label, transform } = header; // Destructure header properties.

                    let value = item[key]; // Get the raw value from the item using the specified key.

                    // Apply a transformation function if provided in the header configuration.
                    // This allows for custom formatting (e.g., date formatting, status mapping).
                    if (transform && typeof transform === 'function') {
                        value = transform(value, item); // Pass both value and the full item to the transform function.
                    }

                    // Handle null or undefined values by replacing them with 'N/A' for better Excel display.
                    if (value === null || value === undefined) {
                        value = 'N/A';
                    }

                    // Assign the transformed value to the `transformedItem` using the `label` as the new column header.
                    transformedItem[label] = value;
                });

                return transformedItem; // Return the fully transformed row.
            });

            // Step 3: Create Excel worksheet and workbook
            // Convert the array of transformed JSON objects into an XLSX worksheet.
            const ws = XLSX.utils.json_to_sheet(exportData);
            // Create a new empty XLSX workbook.
            const wb = XLSX.utils.book_new();
            // Append the generated worksheet to the workbook with the specified `sheetName`.
            XLSX.utils.book_append_sheet(wb, ws, sheetName);

            // Step 4: Auto-size columns for better readability
            const colWidths = [];
            // Iterate over the keys (column headers) of the first transformed data row.
            // If `exportData` is empty, `exportData[0]` will be undefined, so use `{}` as a fallback.
            Object.keys(exportData[0] || {}).forEach(key => {
                // Calculate the optimal column width: either the length of the header label
                // or a minimum of 15 characters, whichever is greater.
                colWidths.push({ wch: Math.max(key.length, 15) });
            });
            // Apply the calculated column widths to the worksheet.
            ws['!cols'] = colWidths;

            // Step 5: Generate filename with a timestamp
            // Get the current date in ISO format and extract only the date part.
            const timestamp = new Date().toISOString().split('T')[0];
            // Construct the final filename by appending the timestamp and '.xlsx' extension.
            const finalFilename = `${filename}_${timestamp}.xlsx`;

            // Step 6: Export the file
            // Write the workbook to an array buffer in XLSX format.
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            // Create a Blob object from the array buffer with the specified MIME type for Excel files.
            const blob = new Blob([excelBuffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            // Use file-saver to prompt the user to download the generated Blob with the `finalFilename`.
            saveAs(blob, finalFilename);

            // Step 7: Call the optional onExport callback
            // If an `onExport` function is provided, call it with export details.
            if (onExport && typeof onExport === 'function') {
                onExport({
                    filename: finalFilename,
                    recordCount: data.length,
                    timestamp: new Date()
                });
            }
        } catch (error) {
            // Step 8: Handle any errors during the export process
            console.error('Error exporting to Excel:', error);
            // Inform the user about the error.
            alert('Error occurred while exporting to Excel. Please try again.');
        }
    };

    return (
        <Button
            variant={variant} // Button visual style
            color={color}     // Button color theme
            size={size}       // Button size
            startIcon={<ExportIcon />} // Icon displayed at the start of the button text
            onClick={handleExport}     // Event handler for button click
            // Disable the button if explicitly disabled by props or if no data is available for export.
            disabled={disabled || !data || data.length === 0}
            sx={{ minWidth: 160 }} // Minimum width for consistent button size
            {...buttonProps} // Spread any additional button props
        >
            {buttonText} {/* Text displayed on the button */}
        </Button>
    );
};

export default ExcelExport;

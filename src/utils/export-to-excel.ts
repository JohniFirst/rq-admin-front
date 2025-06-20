import * as XLSX from 'xlsx'

/**
 * Handles exporting data to an Excel file.
 *
 * @param {ExcelData} headers - The headers for the Excel file.
 * @param {string} data - The data to be exported to the Excel file.
 * @param {string} fileName - The name of the Excel file. Default is "your_file_name.xlsx".
 * @return {void} No return value, exports data to a file instead.
 */
export function exportToExcel({ headers, data }: ExcelData, fileName = 'your_file_name.xlsx') {
	const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
	// 设置表头样式
	worksheet.A1.s = {
		font: { bold: true },
		alignment: { horizontal: 'center' },
	}

	worksheet['!margins'] = {
		bottom: 10,
	}

	// 为数据添加边框
	for (let row = 1; row <= data.length + 1; row++) {
		for (let col = 1; col <= headers.length; col++) {
			const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })]
			if (cell) {
				cell.s = {
					border: {
						top: { style: 'thin' },
						bottom: { style: 'thin' },
						left: { style: 'thin' },
						right: { style: 'thin' },
					},
				}
			}
		}
	}

	const workbook = XLSX.utils.book_new()
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')
	XLSX.writeFile(workbook, fileName)
}

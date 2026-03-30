import * as XLSX from 'xlsx';

type ExcelRow = Record<string, unknown>;

/**
 * Exporta datos a un archivo Excel (.xlsx)
 * @param data - Array de objetos con los datos a exportar
 * @param fileName - Nombre del archivo (sin extensión)
 * @param sheetName - Nombre de la hoja (opcional, por defecto "Datos")
 */
export const exportToExcel = (
  data: ExcelRow[],
  fileName: string,
  sheetName: string = 'Datos'
): void => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();

  // Convertir los datos a una hoja de cálculo
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ajustar el ancho de las columnas automáticamente
  const columnWidths = Object.keys(data[0]).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => {
        const value = row[key];
        return value ? String(value).length : 0;
      })
    );
    return { wch: Math.min(maxLength + 2, 50) }; // Máximo 50 caracteres
  });

  worksheet['!cols'] = columnWidths;

  // Agregar la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generar el archivo y descargarlo
  // El tipo 'binary' asegura compatibilidad máxima
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { 
    bookType: 'xlsx',
    type: 'binary'
  });
};

/**
 * Exporta múltiples conjuntos de datos a diferentes hojas en un mismo archivo Excel
 * @param dataSheets - Array de objetos con data y sheetName
 * @param fileName - Nombre del archivo (sin extensión)
 */
export const exportMultipleSheetsToExcel = (
  dataSheets: { data: ExcelRow[]; sheetName: string }[],
  fileName: string
): void => {
  if (!dataSheets || dataSheets.length === 0) {
    console.warn('No hay datos para exportar');
    return;
  }

  // Crear un nuevo libro de trabajo
  const workbook = XLSX.utils.book_new();

  dataSheets.forEach(({ data, sheetName }) => {
    if (data && data.length > 0) {
      // Convertir los datos a una hoja de cálculo
      const worksheet = XLSX.utils.json_to_sheet(data);

      // Ajustar el ancho de las columnas
      const columnWidths = Object.keys(data[0]).map((key) => {
        const maxLength = Math.max(
          key.length,
          ...data.map((row) => {
            const value = row[key];
            return value ? String(value).length : 0;
          })
        );
        return { wch: Math.min(maxLength + 2, 50) };
      });

      worksheet['!cols'] = columnWidths;

      // Agregar la hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
  });

  // Generar el archivo y descargarlo
  XLSX.writeFile(workbook, `${fileName}.xlsx`, { 
    bookType: 'xlsx',
    type: 'binary'
  });
};

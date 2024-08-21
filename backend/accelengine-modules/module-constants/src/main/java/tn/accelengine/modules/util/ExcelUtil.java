package tn.accelengine.modules.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;

import tn.accelengine.commons.utils.DateTimeUtil;
import tn.accelengine.core.exceptions.AEBusinessException;
import tn.accelengine.core.utils.FileUtil;

public class ExcelUtil {

    public static CellStyle[][] buildMatrixOfStyles(SXSSFWorkbook workbook, Object[][] datas, List<Integer> indexesOfHeaders) {
        List<List<CellStyle>> matrixStyles = new ArrayList<List<CellStyle>>();
        int numberColumns = -1;
        for (int i = 0; i < datas.length; i++) {
            List<CellStyle> listStyles = new ArrayList<CellStyle>();
            matrixStyles.add(i, listStyles);
            if (datas[i].length > numberColumns) {
                numberColumns = datas[i].length;
            }
            for (int j = 0; j < datas[i].length; j++) {
                CellStyle style = workbook.createCellStyle();
                if (indexesOfHeaders.contains(i)) {
                    style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                    style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                    Font font = workbook.createFont();
                    font.setBold(true);
                    style.setFont(font);
                }
                style.setBorderBottom(BorderStyle.THIN);
                style.setBorderTop(BorderStyle.THIN);
                style.setBorderLeft(BorderStyle.THIN);
                style.setBorderRight(BorderStyle.THIN);
                style.setAlignment(HorizontalAlignment.CENTER);
                style.setVerticalAlignment(VerticalAlignment.CENTER);
                listStyles.add(j, style);
            }
        }

        CellStyle[][] cellStyles = new CellStyle[matrixStyles.size()][numberColumns];
        for (int i = 0; i < matrixStyles.size(); i++) {
            for (int j = 0; j < matrixStyles.get(i).size(); j++) {
                cellStyles[i][j] = matrixStyles.get(i).get(j);
            }
        }
        return cellStyles;
    }

    public static File create(SXSSFWorkbook workbook, Object[][] datas, String sheetName, String filePath, String fileName,
            CellStyle[][] cellStyles, boolean A4Format) {
        if (sheetName == null) {
            sheetName = "Datas";
        }
        if (filePath == null) {
            throw new AEBusinessException("message", "Le chemin du dossier d'exportation n'est pas spécifié");
        }
        SXSSFSheet sheet = workbook.createSheet(sheetName);
        if(A4Format) {
            sheet.setFitToPage(true);
        }
        sheet.setRandomAccessWindowSize(datas.length);
        sheet.trackAllColumnsForAutoSizing();
        if (datas != null) {
            setCellData(sheet, datas);
            if (cellStyles != null) {
                setCellStyle(workbook, sheet, cellStyles);
            }
        }
        return creatFile(workbook, filePath, fileName);
    }

    private static void setCellStyle(SXSSFWorkbook workbook, SXSSFSheet sheet, CellStyle[][] cellStyles) {
        for (int i = 0; i < cellStyles.length; i++) {
            SXSSFRow row = sheet.getRow(i);
            if (row != null) {
                for (int j = 0; j < cellStyles[i].length; j++) {
                    if (cellStyles[i][j] != null) {
                        Cell cell = row.getCell(j);
                        if (cell != null) {
                            XSSFCellStyle newStyle = (XSSFCellStyle) workbook.createCellStyle();
                            newStyle.cloneStyleFrom(cellStyles[i][j]);
                            cell.setCellStyle(newStyle);
                        }
                    }
                }
            }
        }
    }

    private static void setCellData(SXSSFSheet sheet, Object[][] datas) {
        int rowCount = 0;
        int length = datas.length;
        for (int i = 0; i < length; i++) {
            Object[] data = datas[i];
            int rowIdx = rowCount++;
            Row row = sheet.createRow(rowIdx);
            int columnCount = 0;
            int lengthRow = data.length;
            for (int j = 0; j < lengthRow; j++) {
                Object field = data[j];
                if (field != null) {
                    int colIdx = columnCount++;
                    Cell cell = row.createCell(colIdx);
                    sheet.autoSizeColumn(colIdx);
                    cell.setCellValue(field.toString());
                }
            }
        }
    }

    private static File creatFile(SXSSFWorkbook workbook, String filePath, String fileName) {
        File file = null;
        try {
            file = FileUtil.creatFile(filePath, fileName, true);
            FileOutputStream outputStream = new FileOutputStream(file);
            workbook.write(outputStream);
            workbook.close();
            outputStream.close();
        } catch (IOException var5) {
            var5.printStackTrace();
        }
        return file;
    }

    private void customizeRows(SXSSFSheet sheet, List<Integer> indexOfHeaders) {
        for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
            if (indexOfHeaders.contains(i)) {
                SXSSFRow row = sheet.getRow(i);
                row.setHeightInPoints((short) 40);
            }
        }
    }

    public static Object convertNullToEmptyString(Object o) {
        if (o == null) {
            return "";
        }
        return o;
    }

    public static Object convertDateToString(Date date) {
        if (date == null) {
            return "";
        }
        return DateTimeUtil.format(date, "dd-MM-yyyy");
    }

    public static Object[][] convertData(List<List<Object>> dataToExport) {
        if (dataToExport == null) {
            return new Object[][] {};
        }
        var numberColumns = dataToExport.stream().map(objects -> objects.size()).mapToInt(value -> value).max().orElse(0);
        Object[][] datas = new Object[dataToExport.size()][numberColumns];
        for (int i = 0; i < dataToExport.size(); i++) {
            for (int j = 0; j < dataToExport.get(i).size(); j++) {
                datas[i][j] = dataToExport.get(i).get(j);
            }
        }
        return datas;
    }
}

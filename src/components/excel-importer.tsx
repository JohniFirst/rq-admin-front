import React, { useState } from 'react'
import * as XLSX from 'xlsx'

interface ExcelImporterProps<T> {
  onImportSuccess: (result: {
    data: T[]
    sheetName: string
    rawData: Record<string, string>[] // 原始数据（包含中文键）
  }) => void
  buttonText?: string
  columnMapping?: Record<string, keyof T> // 中文列名到目标类型键的映射
  requiredColumns?: (keyof T)[] // 必需的目标字段
  onError?: (error: Error) => void
  buttonStyle?: React.CSSProperties
}

const ExcelImporter = <T,>({
  onImportSuccess,
  buttonText = '选择Excel文件',
  columnMapping,
  requiredColumns = [],
  onError = err => console.error('导入错误:', err),
  buttonStyle,
}: ExcelImporterProps<T>): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const [fileInputKey, setFileInputKey] = useState(Date.now())

  // 重置文件输入框（允许重复选择同一文件）
  const resetFileInput = () => {
    setFileInputKey(Date.now())
  }

  // 验证文件类型
  const validateFile = (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      onError(new Error('请选择.xlsx或.xls格式的Excel文件'))
      return false
    }
    return true
  }

  // 处理列名映射
  const mapColumns = (rawData: Record<string, string>[]): T[] => {
    if (!columnMapping) {
      // 无映射时直接返回（假设列名与目标类型键完全一致）
      return rawData as unknown as T[]
    }

    // 执行列名映射
    return rawData.map(item => {
      const mappedItem: Partial<T> = {}

      // 遍历映射关系
      Object.entries(columnMapping).forEach(([excelColumnName, targetKey]) => {
        // 支持模糊匹配（忽略前后空格）
        const matchedKey = Object.keys(item).find(key => key.trim() === excelColumnName.trim())

        if (matchedKey !== undefined) {
          mappedItem[targetKey] = item[matchedKey] as T[keyof T]
        }
      })

      return mappedItem as T
    })
  }

  // 验证必需字段
  const validateRequiredColumns = (data: T[]): void => {
    if (requiredColumns.length === 0 || data.length === 0) return

    const firstItem = data[0]
    const missingFields = requiredColumns.filter(field => firstItem[field] === undefined)

    if (missingFields.length > 0) {
      throw new Error(`缺少必需的字段: ${missingFields.join(', ')}\n请检查Excel列名是否正确`)
    }
  }

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!validateFile(file)) {
      resetFileInput()
      return
    }

    try {
      setIsLoading(true)

      // 读取文件内容
      const data = await new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = event => {
          if (event.target?.result) {
            resolve(event.target.result as ArrayBuffer)
          } else {
            reject(new Error('无法读取文件内容'))
          }
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsArrayBuffer(file)
      })

      // 解析Excel
      const workbook = XLSX.read(new Uint8Array(data), { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // 获取原始数据（保留Excel中的原始列名）
      const rawData: Record<string, string>[] = XLSX.utils.sheet_to_json(worksheet)

      if (rawData.length === 0) {
        throw new Error('Excel文件中未找到数据，请检查文件内容')
      }

      // 处理列名映射
      const mappedData = mapColumns(rawData)

      // 验证必需字段
      validateRequiredColumns(mappedData)

      // 通知导入成功
      onImportSuccess({ data: mappedData, sheetName, rawData })
    } catch (error) {
      onError(error instanceof Error ? error : new Error(String(error)))
    } finally {
      setIsLoading(false)
      resetFileInput()
    }
  }

  return (
    <div className="excel-importer">
      <label style={{ ...buttonStyle, cursor: 'pointer' }}>
        <input
          key={fileInputKey}
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          disabled={isLoading}
        />
        <span>
          {isLoading ? (
            <span>
              <i className="fas fa-spinner fa-spin mr-2"></i>处理中...
            </span>
          ) : (
            <span>
              <i className="fas fa-file-excel mr-2"></i>
              {buttonText}
            </span>
          )}
        </span>
      </label>
    </div>
  )
}

export default ExcelImporter

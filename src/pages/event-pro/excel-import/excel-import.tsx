import ExcelImporter from '@/components/excel-importer'

// 定义Excel数据的类型（根据实际Excel结构定义）
interface UserData {
  id: number
  name: string
  age: number
  email: string
  gender: string
  address: string
  maritalStatus: string
  workExperience: number
  salary: number
  note: string
}

export default function ExcelImport() {
  // 处理导入成功的数据
  const handleImportSuccess = (result: { data: UserData[]; sheetName: string }) => {
    console.log(`成功导入工作表: ${result.sheetName}`)
    console.log('导入的数据:', result.data)
  }

  return (
    <div>
      <ExcelImporter<UserData>
        onImportSuccess={handleImportSuccess}
        buttonText="选择Excel文件"
        columnMapping={{
          编号: 'id',
          姓名: 'name',
          年龄: 'age',
          邮箱地址: 'email',
          性别: 'gender',
          家庭住址: 'address',
          婚姻状况: 'maritalStatus',
          工作年限: 'workExperience',
          薪资待遇: 'salary',
          备注: 'note',
        }}
        requiredColumns={['id', 'name', 'email']}
      />
    </div>
  )
}

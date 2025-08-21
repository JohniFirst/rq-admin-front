import styled from 'styled-components'
import EnumsKeys, { EnumsTypes } from '@/pages/system/enum/components/EnumsKeys.tsx'
import EnumsOptions from '@/pages/system/enum/components/EnumsOptions.tsx'
import { useState } from 'react'

const EnumWp = styled.div`
  display: grid;
  grid-template-columns: 1fr 600px;
  gap: 16px;

  section {
    padding: 12px 16px;
    border: 1px solid #ccc;
  }
`

function Enum() {
  // 状态管理：存储当前选中的枚举项
  const [selectedEnum, setSelectedEnum] = useState<EnumsTypes | null>(null)

  return (
    <EnumWp>
      <section>
        <EnumsKeys onSelect={setSelectedEnum} />
      </section>

      <section>
        <EnumsOptions selectedEnum={selectedEnum} />
      </section>
    </EnumWp>
  )
}

export default Enum

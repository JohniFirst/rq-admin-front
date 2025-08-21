import styled from 'styled-components'
import EnumsKeys from '@/pages/system/enum/components/EnumsKeys.tsx'
import EnumsOptions from '@/pages/system/enum/components/EnumsOptions.tsx'

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
  return (
    <EnumWp>
      <section>
        <EnumsKeys />
      </section>

      <section>
        <EnumsOptions />
      </section>
    </EnumWp>
  )
}

export default Enum

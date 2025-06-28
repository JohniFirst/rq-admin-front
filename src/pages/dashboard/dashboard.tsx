import {
  BankOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  PieChartOutlined,
  StrikethroughOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLoaderData } from 'react-router-dom'
import ChartOfCustomerIncomeProportion from '@/components/dashboard/chart-of-customer-income-proportion.tsx'
import ChartOfCustomerNumbers from '@/components/dashboard/chart-of-customer-numbers.tsx'
import ChartOfDiningAndEntryTimeRelation from '@/components/dashboard/chart-of-dining-and-entry-time-relation.tsx'
import ChartOfDishSales from '@/components/dashboard/chart-of-dish-sales.tsx'
import ChartOfDynamicSales from '@/components/dashboard/chart-of-dynamic-sales.tsx'
import ChartOfGuestSourcePie from '@/components/dashboard/chart-of-guest-source-pie.tsx'
import ChartOfInStorePeople from '@/components/dashboard/chart-of-in-store-people.tsx'
import ChartOfOrderRelation from '@/components/dashboard/chart-of-order-relation.tsx'
import ChartOfPayMethodRelation from '@/components/dashboard/chart-of-pay-method-relation.tsx'
import NumberJumping from '@/components/number-jumping'

function Dashboard() {
  const data = useLoaderData()
  console.log('from route loader:', data)

  return (
    <div className="grid grid-cols-8 gap-4">
      {/* 进店人数 */}
      <li className="custom-container flex xl:col-span-2 md:col-span-3 sm:col-span-4">
        <UserOutlined style={{ fontSize: '50px', color: '#ff5500', width: '70px' }} />
        <div className="flex-1">
          <p>进店人数/人次</p>
          <p className="text-2xl my-2 flex justify-between" style={{ color: 'red' }}>
            <NumberJumping endValue={5000} />
            <CaretUpOutlined style={{ color: 'red' }} />
          </p>
          <p className="text-sm">每天为一个统计周期</p>
        </div>
      </li>

      {/* 销售额 */}
      <li className="custom-container flex xl:col-span-2 md:col-span-3 sm:col-span-4">
        <StrikethroughOutlined style={{ fontSize: '50px', color: 'red', width: '70px' }} />
        <div className="flex-1">
          <p>销售额/元</p>
          <p className="text-2xl my-2 flex justify-between" style={{ color: 'red' }}>
            <NumberJumping endValue={98748780.56} />
            <CaretDownOutlined style={{ color: 'green' }} />
          </p>
          <p className="text-sm">呈现下降趋势</p>
        </div>
      </li>

      {/* 经营目标 */}
      <li className="custom-container flex xl:col-span-2 md:col-span-3 sm:col-span-4">
        <PieChartOutlined style={{ fontSize: '50px', color: '#9dffa7', width: '70px' }} />
        <div className="flex-1">
          <p>经营目标/完成率</p>
          <p className="text-2xl my-2 flex justify-between" style={{ color: 'red' }}>
            <span>
              <NumberJumping endValue={66} />%
            </span>
            <CaretDownOutlined style={{ color: 'green' }} />
          </p>
          <p className="text-sm">实际完成的比例</p>
        </div>
      </li>

      {/* 当月利润 */}
      <li className="custom-container flex xl:col-span-2 md:col-span-3 sm:col-span-4">
        <BankOutlined style={{ fontSize: '50px', color: '#307dff', width: '70px' }} />
        <div className="flex-1">
          <p>当月利润/元</p>
          <p className="text-2xl my-2 flex justify-between" style={{ color: 'red' }}>
            <NumberJumping endValue={56456.98} />
            <CaretUpOutlined style={{ color: 'red' }} />
          </p>
          <p className="text-sm">扣除经营成本之后所得</p>
        </div>
      </li>

      <div className="custom-container col-span-5">
        <ChartOfInStorePeople />
      </div>

      <div className="custom-container col-span-3">
        <ChartOfGuestSourcePie />
      </div>

      <section className="custom-container col-span-8">
        <ChartOfOrderRelation />
      </section>

      <section className="custom-container col-span-8">
        <ChartOfDynamicSales />
      </section>

      <section className="custom-container col-span-4">
        <ChartOfPayMethodRelation />
      </section>

      <section className="custom-container col-span-4">
        <ChartOfDiningAndEntryTimeRelation />
      </section>

      <section className="custom-container col-span-3">
        <ChartOfDishSales />
      </section>

      <section className="custom-container col-span-2">
        <ChartOfCustomerIncomeProportion />
      </section>

      <section className="custom-container col-span-3">
        <ChartOfCustomerNumbers />
      </section>
    </div>
  )
}

export default Dashboard

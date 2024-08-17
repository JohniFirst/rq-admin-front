import { useLoaderData } from 'react-router-dom'
import ChartOfInStorePeople from './components/chart-of-in-store-people.tsx'
import dashboardStyles from './css/dashboard.module.css'
import ChartOfGuestSourcePie from './components/chart-of-guest-source-pie.tsx'
import ChartOfOrderRelation from './components/chart-of-order-relation.tsx'
import ChartOfDiningAndEntryTimeRelation from './components/chart-of-dining-and-entry-time-relation.tsx'
import ChartOfPayMethodRelation from './components/chart-of-pay-method-relation.tsx'
import NumberJumping from '@/components/number-jumping'
import ChartOfDishSales from '@/pages/dashboard/components/chart-of-dish-sales.tsx'
import ChartOfCustomerIncomeProportion from '@/pages/dashboard/components/chart-of-customer-income-proportion.tsx'
import ChartOfCustomerNumbers from '@/pages/dashboard/components/chart-of-customer-numbers.tsx'
import ChartOfDynamicSales from '@/pages/dashboard/components/chart-of-dynamic-sales.tsx'

import {
  BankOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  PieChartOutlined,
  StrikethroughOutlined,
  UserOutlined,
} from '@ant-design/icons'

function Dashboard() {
  const data = useLoaderData()
  console.log('from route loader:', data)

  return (
    <>
      <ul className={dashboardStyles.businessDataWP}>
        {/* 进店人数 */}
        <li className="container flex">
          <UserOutlined
            style={{ fontSize: '50px', color: '#ff5500', width: '70px' }}
          />
          <div className="flex-1">
            <p>进店人数/人次</p>
            <p
              className="text-2xl my-2 flex justify-between"
              style={{ color: 'red' }}
            >
              <NumberJumping endValue={5000} />
              <CaretUpOutlined style={{ color: 'red' }} />
            </p>
            <p className="text-sm">每天为一个统计周期</p>
          </div>
        </li>

        {/* 销售额 */}
        <li className="container flex">
          <StrikethroughOutlined
            style={{ fontSize: '50px', color: 'red', width: '70px' }}
          />
          <div className="flex-1">
            <p>销售额/元</p>
            <p
              className="text-2xl my-2 flex justify-between"
              style={{ color: 'red' }}
            >
              <NumberJumping endValue={98748780.56} />
              <CaretDownOutlined style={{ color: 'green' }} />
            </p>
            <p className="text-sm">呈现下降趋势</p>
          </div>
        </li>

        {/* 经营目标 */}
        <li className="container flex">
          <PieChartOutlined
            style={{ fontSize: '50px', color: '#9dffa7', width: '70px' }}
          />
          <div className="flex-1">
            <p>经营目标/完成率</p>
            <p
              className="text-2xl my-2 flex justify-between"
              style={{ color: 'red' }}
            >
              <span>
                <NumberJumping endValue={66} />%
              </span>
              <CaretDownOutlined style={{ color: 'green' }} />
            </p>
            <p className="text-sm">实际完成的比例</p>
          </div>
        </li>

        {/* 当月利润 */}
        <li className="container flex">
          <BankOutlined
            style={{ fontSize: '50px', color: '#307dff', width: '70px' }}
          />
          <div className="flex-1">
            <p>当月利润/元</p>
            <p
              className="text-2xl my-2 flex justify-between"
              style={{ color: 'red' }}
            >
              <NumberJumping endValue={56456.98} />
              <CaretUpOutlined style={{ color: 'red' }} />
            </p>
            <p className="text-sm">扣除经营成本之后所得</p>
          </div>
        </li>
      </ul>

      <section className={dashboardStyles.echartsWp}>
        <div className="container">
          <ChartOfInStorePeople />
        </div>

        <div className="container">
          <ChartOfGuestSourcePie />
        </div>
      </section>

      <section className="container">
        <ChartOfOrderRelation />
      </section>

      <section className="container mt-[16px]">
        <ChartOfDynamicSales />
      </section>

      <section className={dashboardStyles.payRelationWp}>
        <section className="container">
          <ChartOfPayMethodRelation />
        </section>

        <section className="container">
          <ChartOfDiningAndEntryTimeRelation />
        </section>
      </section>

      <section className={dashboardStyles.chartBottomWp}>
        <section className="container">
          <ChartOfDishSales />
        </section>

        <section className="container">
          <ChartOfCustomerIncomeProportion />
        </section>

        <section className="container">
          <ChartOfCustomerNumbers />
        </section>
      </section>
    </>
  )
}

export default Dashboard

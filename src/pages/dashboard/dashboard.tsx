import {
  BankOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  PieChartOutlined,
  StrikethroughOutlined,
  UserOutlined,
} from '@ant-design/icons'
import React, { memo, useMemo } from 'react'
import { useLoaderData } from 'react-router-dom'
import styled from 'styled-components'
import NumberJumping from '@/components/number-jumping'
import ChartOfCustomerIncomeProportion from '@/pages/dashboard/components/chart-of-customer-income-proportion'
import ChartOfCustomerNumbers from '@/pages/dashboard/components/chart-of-customer-numbers'
import ChartOfDiningAndEntryTimeRelation from '@/pages/dashboard/components/chart-of-dining-and-entry-time-relation'
import ChartOfDishSales from '@/pages/dashboard/components/chart-of-dish-sales'
import ChartOfDynamicSales from '@/pages/dashboard/components/chart-of-dynamic-sales'
import ChartOfGuestSourcePie from '@/pages/dashboard/components/chart-of-guest-source-pie'
import ChartOfInStorePeople from '@/pages/dashboard/components/chart-of-in-store-people'
import ChartOfOrderRelation from '@/pages/dashboard/components/chart-of-order-relation'
import ChartOfPayMethodRelation from '@/pages/dashboard/components/chart-of-pay-method-relation'

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 100%;

  @media (max-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

const StatCard = styled.div<{ $span: number }>`
  grid-column: span ${props => props.$span};
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1280px) {
    grid-column: span ${props => Math.min(props.$span * 2, 4)};
  }

  @media (max-width: 768px) {
    grid-column: span 1;
    padding: 1rem;
  }

  .dark & {
    background: var(--color-surface);
  }
`

const IconWrapper = styled.div<{ $color: string }>`
  font-size: 3.125rem;
  color: ${props => props.$color};
  width: 70px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StatContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StatTitle = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: 500;
`

const StatValue = styled.div<{ $color?: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: ${props => props.$color || 'var(--color-text)'};

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`

const StatDescription = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-disabled);
`

const ChartCard = styled.section<{ $span: number }>`
  grid-column: span ${props => props.$span};
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 1280px) {
    grid-column: span ${props => Math.min(props.$span * 2, 4)};
  }

  @media (max-width: 768px) {
    grid-column: span 1;
    padding: 1rem;
  }

  .dark & {
    background: var(--color-surface);
  }
`

const TrendIcon = styled.span<{ $type: 'up' | 'down' }>`
  color: ${props => (props.$type === 'up' ? '#ef4444' : '#10b981')};
  font-size: 1.25rem;
`

// Memoized stat card component for better performance
const StatisticCard = memo<{
  icon: React.ReactNode
  iconColor: string
  title: string
  value: number
  trend: 'up' | 'down'
  description: string
  span: number
  valueColor?: string
  isPercentage?: boolean
}>(({ icon, iconColor, title, value, trend, description, span, valueColor, isPercentage }) => (
  <StatCard $span={span}>
    <IconWrapper $color={iconColor}>{icon}</IconWrapper>
    <StatContent>
      <StatTitle>{title}</StatTitle>
      <StatValue $color={valueColor}>
        <span>
          <NumberJumping endValue={value} />
          {isPercentage && '%'}
        </span>
        <TrendIcon $type={trend}>
          {trend === 'up' ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </TrendIcon>
      </StatValue>
      <StatDescription>{description}</StatDescription>
    </StatContent>
  </StatCard>
))

StatisticCard.displayName = 'StatisticCard'

// Memoized chart wrapper for better performance
const ChartWrapper = memo<{ children: React.ReactNode; span: number }>(({ children, span }) => (
  <ChartCard $span={span}>{children}</ChartCard>
))

ChartWrapper.displayName = 'ChartWrapper'

// 预加载 echarts 配置模块，避免首次加载时的闪烁
import '@/config/echarts'

function Dashboard() {
  useLoaderData() // 预加载数据

  // 使用 useMemo 缓存统计数据，避免重复创建
  const statistics = useMemo(
    () => [
      {
        icon: <UserOutlined />,
        iconColor: '#ff5500',
        title: '进店人数/人次',
        value: 5000,
        trend: 'up' as const,
        description: '每天为一个统计周期',
        span: 2,
        valueColor: '#ef4444',
      },
      {
        icon: <StrikethroughOutlined />,
        iconColor: '#ef4444',
        title: '销售额/元',
        value: 98748780.56,
        trend: 'down' as const,
        description: '呈现下降趋势',
        span: 2,
        valueColor: '#ef4444',
      },
      {
        icon: <PieChartOutlined />,
        iconColor: '#9dffa7',
        title: '经营目标/完成率',
        value: 66,
        trend: 'down' as const,
        description: '实际完成的比例',
        span: 2,
        valueColor: '#ef4444',
        isPercentage: true,
      },
      {
        icon: <BankOutlined />,
        iconColor: '#307dff',
        title: '当月利润/元',
        value: 56456.98,
        trend: 'up' as const,
        description: '扣除经营成本之后所得',
        span: 2,
        valueColor: '#ef4444',
      },
    ],
    [],
  )

  // 使用 useMemo 缓存图表配置
  const chartConfigs = useMemo(
    () => [
      { span: 5 as const, Component: ChartOfInStorePeople },
      { span: 3 as const, Component: ChartOfGuestSourcePie },
      { span: 8 as const, Component: ChartOfOrderRelation },
      { span: 8 as const, Component: ChartOfDynamicSales },
      { span: 4 as const, Component: ChartOfPayMethodRelation },
      { span: 4 as const, Component: ChartOfDiningAndEntryTimeRelation },
      { span: 3 as const, Component: ChartOfDishSales },
      { span: 2 as const, Component: ChartOfCustomerIncomeProportion },
      { span: 3 as const, Component: ChartOfCustomerNumbers },
    ],
    [],
  )

  return (
    <DashboardGrid>
      {statistics.map((stat, index) => (
        <StatisticCard key={index} {...stat} />
      ))}
      {chartConfigs.map((config, index) => (
        <ChartWrapper key={`chart-${index}`} span={config.span}>
          <config.Component />
        </ChartWrapper>
      ))}
    </DashboardGrid>
  )
}

export default Dashboard

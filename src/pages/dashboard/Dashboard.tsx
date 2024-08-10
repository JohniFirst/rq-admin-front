import { useLoaderData } from "react-router-dom";
import ChartOfInStorePeople from "./ChartOfInStorePeople";
import dashboardStyles from "./css/dashboard.module.css";
import ChartOfGuestSourcePie from "./ChartOfGuestSourcePie";
import ChartOfOrderRelation from "./ChartOfOrderRelation";
import ChartOfDiningAndEntryTimeRelation from "./ChartOfDiningAndEntryTimeRelation";
import ChartOfPayMethodRelation from "./ChartOfPayMethodRelation";
import NumberJumping from "@/components/NumberJumping";
import ChartOfDishSales from "@/pages/dashboard/ChartOfDishSales.tsx";
import ChartOfCustomerIncomeProportion from "@/pages/dashboard/ChartOfCustomerIncomeProportion.tsx";
import ChartOfCustomerNumbers from "@/pages/dashboard/ChartOfCustomerNumbers.tsx";
import ChartOfDynamicSales from "@/pages/dashboard/ChartOfDynamicSales.tsx";

function Dashboard() {
  const data = useLoaderData();
  console.log("from route loader:", data);

  return (
    <>
      <ul className={dashboardStyles.businessDataWP}>
        <li className="container">
          <NumberJumping endValue={500000} duration={1000} />
        </li>
        <li className="container">123123</li>
        <li className="container">123123</li>
        <li className="container">123123</li>
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
  );
}

export default Dashboard;

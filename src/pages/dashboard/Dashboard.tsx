import { useLoaderData } from "react-router-dom";

function Dashboard() {
  const data = useLoaderData();
  console.log("from route loader:", data);

  return <div>Dashboard</div>;
}

export default Dashboard;

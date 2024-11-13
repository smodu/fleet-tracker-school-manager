import { Overview } from "@/components/Overview"
import LiveMap from "@/components/LiveMap"

const Dashboard = () => {
  const center = [-122.4194, 37.7749];
  const zoom = 13;
  return (
    <div className="p-4 flex flex-col gap-4 bg-[#2B2B2B]">
      <Overview />
    </div>
    // <div className="h-screen">
    //   <LiveMap center={center} zoom={zoom} />
    // </div>
  )
}
export default Dashboard
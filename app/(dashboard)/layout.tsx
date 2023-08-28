import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { getApiLimitCount } from "@/lib/api-limit"

const DashboardLayout = async ({ children}: {
  children: React.ReactNode
}) => {
  const apiLimitCount = await getApiLimitCount()

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900 overflow-auto">
        <Sidebar apiLimitCount={apiLimitCount} />
      </div>

      <main className="md:pl-72">
        <Navbar apiLimitCount={apiLimitCount} />
        <div className="mt-6 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
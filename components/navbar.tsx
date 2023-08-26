import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className="flex items-center p-4">
      <Button variant="ghost" size="icon" className="md:hidden">
        <Menu />
      </Button>

      <div className="flex justify-end w-full">
        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
}

export default Navbar
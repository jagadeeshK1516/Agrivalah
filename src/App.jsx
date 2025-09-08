import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
// import { AuthProvider } from "@/hooks/useAuth"

function App() {
  return (
    <>
      <Pages />
      <Toaster />
    </>
  )
}

export default App 
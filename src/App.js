import Navbar from "./components/layouts/Navbar";
import Home from "./components/Home";

function App() {
  return (
    <div className="App max-w-[1600px] flex flex-col h-screen">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;

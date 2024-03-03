import "./App.css";
import Navigation from "./nav";
import { HomePage } from "./home/Home";

function App() {
  alert ('testing branch');
  return (
    <div className="App">
      <Navigation />
      <HomePage />
    </div>
  );
}

export default App;


import './App.css';
import Create from './components/Create';
import {Container} from 'reactstrap'
function App() {
  return (
    <Container className="App">
      <header className="App-header">
        <h3>shortlink by country!</h3>

        
      </header>

      <Create />
    </Container>
  );
}

export default App;

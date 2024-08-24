import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import MainContent from './components/MainContent';
import { Container } from '@mui/material';

function App() {
  return (
<>
 <div style={{display:"flex",
  width:"100vw",justifyContent:"center", marginTop:"150px",

 }}>
<Container maxWidth="sm">
<MainContent />
</Container>

 </div>
 </>

  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Books from './pages/Books';
import Library from './pages/Library';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Tags from './pages/Tags';
import Reader from './pages/Reader';
import SignUpForm from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import BookLists from './pages/BookLists';

function App() {
  return (
    
    <div>
      <Navbar />
      <div className=" mx-auto p-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/books" element={<Books />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/booklists" element={<BookLists />} />
          <Route path="*" element={<ErrorPage statusCode="404" message="Page Not Found" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

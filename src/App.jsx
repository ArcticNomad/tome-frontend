import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Books from './pages/Books';
import Library from './pages/Library';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Tags from './pages/Tags';
import Reader from './pages/BookReaderPage';
import SignUpForm from './pages/SignUp';
import ErrorPage from './pages/ErrorPage';
import BookLists from './pages/BookLists';
import ProfilePage from './pages/ProfilePage';
import BookshelfPage from './pages/Bookshelf';
import { ToastProvider } from './components/Toast';
import BookDetails from './pages/BookDetails';
import BookReaderPage from './pages/BookReaderPage';

function App() {
  
  return (
    
    <ToastProvider>
      <Navbar />
      <div className="">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/books" element={<Books />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/booklists" element={<BookLists />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookshelf/:shelfType" element={<BookshelfPage />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/read/:bookId?" element={<BookReaderPage />} />



          <Route path="*" element={<ErrorPage statusCode="404" message="Page Not Found" />} />

        </Routes>
      </div>
    </ToastProvider>
  );
}

export default App;

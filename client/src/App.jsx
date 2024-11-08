import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login/Login';
import { Signup } from './pages/Signup/Signup';

const App = () => {
  return (
    <BrowserRouter>
      <div className='p-4 h-screen flex items-center justify-center'>
        <Routes>
          {/* Define your routes here */}
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

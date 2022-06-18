import { FC, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Design from './pages/design'

const App: FC = () => {
    return (
        <Route path="design" element={ <Design /> } />
    )
};

export default App;

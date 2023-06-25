import React, { useState, createContext } from "react";

const BookContext = createContext();

const BookProvider = ({ children, screenContext }) => {
    const [books, setBooks] = useState([]);

    return (
        <BookContext.Provider value={([books, setBooks])}>
            {children}
        </BookContext.Provider>
    )
};

export { BookContext, BookProvider };
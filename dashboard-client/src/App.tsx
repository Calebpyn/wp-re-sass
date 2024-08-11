import { createContext, Dispatch, SetStateAction, useState } from "react";
//Router
import { HashRouter, Route, Routes } from "react-router-dom";

//Components
import AuthPage from "./components/pages/AuthPage";

//Permissions list
import MainFrame from "./components/pages/MainFrame";

type PageContextType = {
  currentPage: number | undefined;
  setCurrentPage: Dispatch<SetStateAction<number | undefined>>;
};

export const PageContext = createContext<PageContextType | undefined>(
  undefined
);

type DialogContextType = {
  isDialogOpen: boolean | undefined;
  setIsDialogOpen: Dispatch<SetStateAction<boolean | undefined>>;
};

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

function App() {
  const [currentPage, setCurrentPage] = useState<number>();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>();

  return (
    <PageContext.Provider value={{ currentPage, setCurrentPage }}>
      <DialogContext.Provider value={{ isDialogOpen, setIsDialogOpen }}>
        <HashRouter>
          <div>
            <Routes>
              <Route path="/" element={<AuthPage />} />
              <Route path="/dashboard" element={<MainFrame />} />
            </Routes>
          </div>
        </HashRouter>
      </DialogContext.Provider>
    </PageContext.Provider>
  );
}

export default App;

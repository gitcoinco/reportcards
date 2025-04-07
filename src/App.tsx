import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { RoundProvider } from "./providers/RoundProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@gitcoin/ui";
import { ProgramProvider } from "./providers/ProgramProvider";
import { RoundDetails } from "./pages/RoundDetails";
import { ProgramDetails } from "./pages/ProgramDetails";
import { SideNav } from "./components/SideNav";
import { useProgram } from "./providers/ProgramProvider";
import { ProgramDropDown } from "./components/ProgramDropDown";
import { Home } from "./pages/Home";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { programId, chainId, roundId } = useParams();
  const { programs } = useProgram();

  // If we're on a round page, find the program that contains this round
  const program = roundId && chainId 
    ? programs.find(p => p.rounds.some(r => r.id === roundId && r.chainId === Number(chainId)))
    : null;

  return (
    <div className="flex min-h-screen p-6">
      {(programId || program) && <SideNav programId={programId || program?.projectId || ""} />}
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
};

const RoundRoute = () => {
  const { chainId, roundId } = useParams();
  if (!chainId || !roundId) return null;

  return (
    <RoundProvider chainId={Number(chainId)} roundId={roundId}>
      <Layout>
        <RoundDetails />
      </Layout>
    </RoundProvider>
  );
};

const ProgramRoute = () => {
  const { programId } = useParams();
  if (!programId) return null;

  return (
    <Layout>
      <ProgramDetails programId={programId} />
    </Layout>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProgramProvider>
          <Navbar showDivider={false} text={{ text: "Metrics", link: "/" }}>
            <ProgramDropDown />
          </Navbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:chainId/:roundId" element={<RoundRoute />} />
            <Route path="/program/:programId" element={<ProgramRoute />} />
          </Routes>
        </ProgramProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

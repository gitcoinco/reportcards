import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { RoundProvider } from "./providers/RoundProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "@gitcoin/ui";
import { ProgramProvider } from "./providers/ProgramProvider";
import { DonationProvider } from "./providers/DonationProvider";
import { RoundDetails } from "./pages/RoundDetails";
import { ProgramDetails } from "./pages/ProgramDetails";
import { SideNav } from "./components/main/SideNav";
import { useProgram } from "./providers/ProgramProvider";
import { ProgramDropDown } from "./components/main/ProgramDropDown";
import { Home } from "./pages/Home";
import Footer from "./components/main/Footer";
const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { programId, chainId, roundId } = useParams();
  const { programs } = useProgram();

  // If we're on a round page, find the program that contains this round
  const program =
    roundId && chainId
      ? programs.find((p) =>
          p.rounds.some(
            (r) => r.id === roundId && r.chainId === Number(chainId)
          )
        )
      : null;

  return (
    <div className="flex min-h-screen p-6">
      {(programId || program) && (
        <SideNav programId={programId || program?.projectId || ""} />
      )}
      <div className="flex-1">{children}</div>
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
  return (
    <Layout>
      <ProgramDetails />
    </Layout>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ProgramProvider>
          <DonationProvider>
            <Navbar
              showDivider={false}
              text={{ text: "Report Cards", link: "/" }}
            >
              <ProgramDropDown />
            </Navbar>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:chainId/:roundId" element={<RoundRoute />} />
              <Route path="/program/:programId" element={<ProgramRoute />} />
            </Routes>
          </DonationProvider>
        </ProgramProvider>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

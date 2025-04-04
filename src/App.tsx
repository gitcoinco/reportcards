import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { RoundProvider } from './providers/RoundProvider';
import { Main } from './main/Main';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const RoundRoute = () => {
  const { chainId, roundId } = useParams();
  if (!chainId || !roundId) return null;
  
  return (
    <RoundProvider chainId={Number(chainId)} roundId={roundId}>
      <Main />
    </RoundProvider>
  );
};

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/:chainId/:roundId" element={<RoundRoute />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

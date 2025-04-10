import { ProgramDropDown } from "../components/main/ProgramDropDown";

export const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <div className="text-sm text-gray-500">Get Started</div>
      <div className="flex flex-col items-center max-w-md">
        <h1 className="text-4xl font-bold">Find data on web3</h1>
        <h1 className="text-4xl font-bold">funding rounds</h1>
      </div>
      <div className="flex flex-col items-center max-w-md">
        <ProgramDropDown />
      </div>
    </div>
  );
}; 
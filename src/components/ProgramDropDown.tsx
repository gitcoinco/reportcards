import { Select } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { useNavigate } from "react-router-dom";

export const ProgramDropDown = () => {
  const { programs, isLoading, error } = useProgram();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Select
      options={[{
        items: programs.map(program => ({
          label: program.projectName,
          value: program.projectId,
        }))
      }]}
      onValueChange={(projectId: string) => {
        navigate(`/program/${projectId}`);
      }}
      placeholder="Select Program"
      size="md"
      variant="outlined"
    />
  );
      
};

import { ProgramStats } from "../components/ProgramStats";
import { useProgram } from "../providers/ProgramProvider";

interface ProgramDetailsProps {
  programId: string;
}

export const ProgramDetails = ({ programId }: ProgramDetailsProps) => {
  const { programs } = useProgram();
  const program = programs.find(p => p.projectId === programId);

  if (!program) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{program.projectName} Stats</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <ProgramStats />
      </div>
    </div>
  );
};

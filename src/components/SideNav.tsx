import { IconType, SideNav as SideNavWrapper } from "@gitcoin/ui";
import { useProgram } from "../providers/ProgramProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SideNavProps {    
  programId: string;
}

export const SideNav = ({ programId }: SideNavProps) => {
  const { programs, isLoading, error } = useProgram();
  const program = programs.find(program => program.projectId.toLowerCase() === programId.toLowerCase());
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | undefined>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const items = [
    {
      content: program?.projectName,
      id: `/program/${programId}`,
      iconType: IconType.HOME,
      items: []
    },
    {
      content: "Detailed Round Metrics",
      iconType: IconType.COLLECTION,
      id: `/${programId}`,
      items: program?.rounds.map(round => ({
        content: round.roundMetadata.name,
        id: `/${round.chainId}/${round.id}`,
        items: []
      })) || []
    }
  ];

  const handleClick = (id: string | undefined) => {
    setActiveId(id);
    if (id) {
      navigate(id);
    }
  };

  return (
    <div className="w-[450px] p-4">
      <SideNavWrapper
        items={items}
        activeId={activeId}
        onClick={handleClick}
        hoverVariant="grey"
        accordionProps={{
          radius: "sm",
          isOpen: true,
        }}
      />
    </div>
  );
};

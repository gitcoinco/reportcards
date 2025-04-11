import { IconType, SideNav as SideNavWrapper } from "@gitcoin/ui";
import { useProgram } from "../../providers/ProgramProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";

interface SideNavProps {
  programId: string;
}

export const SideNav = ({ programId }: SideNavProps) => {
  const { activeProgram, setActiveProgramId } = useProgram();
  const navigate = useNavigate();
  const path = useLocation();

  useEffect(() => {
    if (programId) {
      setActiveProgramId(programId);
    }
  }, [programId, setActiveProgramId]);

  const activeId = useMemo(() => {
    if (path.pathname.includes(`program/`)) {
      return `/program/${programId}`;
    }
    const round = activeProgram?.rounds.find((round) =>
      path.pathname.includes(`${round.chainId}/${round.id}`)
    );
    return `/${round?.chainId}/${round?.id}`;
  }, [path.pathname, programId, activeProgram]);

  if (!activeProgram) {
    return <div>Program not found</div>;
  }

  const items = [
    {
      content: activeProgram.projectName,
      id: `/program/${programId}`,
      iconType: IconType.HOME,
      items: []
    },
    {
      content: "Detailed Round Metrics",
      iconType: IconType.COLLECTION,
      id: `/${programId}`,
      items: activeProgram.rounds.map(round => ({
        content: round.roundMetadata.name,
        id: `/${round.chainId}/${round.id}`,
        items: []
      }))
    }
  ];

  const handleClick = (id: string | undefined) => {
    if (id) {
      navigate(id);
    }
  };

  return (
    <div className="w-[350px] p-4">
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

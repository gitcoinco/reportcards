import React from 'react';
import { ShareButton as GitcoinShareButton } from '@gitcoin/ui';
import { useParams } from 'react-router-dom';
import { useRound } from '../providers/RoundProvider';

export const ShareButton = () => {
    const { chainId, roundId } = useParams();
    const { data } = useRound(Number(chainId), roundId);

    if (!chainId || !roundId || !data) return null;
  
    const shareText = `🌐 ${data.matchAmount} DAI matching pool
      📈 $${data.totalAmountDonatedInUsd.toFixed(2)} funded so far
      🤝 ${data.totalDonationsCount} donations
      👀 Check out ${data.roundName}'s stats! 
  
      ${window.location.href}`;


    return <GitcoinShareButton shareText={shareText} />;
};

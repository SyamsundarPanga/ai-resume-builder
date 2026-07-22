import React from 'react';
import { useBlocker } from 'react-router-dom';
import UnsavedChangesDialog from '../components/dialogs/UnsavedChangesDialog';

interface RouteLeaveGuardProps {
  when: boolean;
}

export const RouteLeaveGuard: React.FC<RouteLeaveGuardProps> = ({ when }) => {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      when && currentLocation.pathname !== nextLocation.pathname
  );

  const handleStay = () => {
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  };

  const handleLeave = () => {
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  };

  return (
    <UnsavedChangesDialog
      isOpen={blocker.state === 'blocked'}
      onStay={handleStay}
      onLeave={handleLeave}
    />
  );
};

export default RouteLeaveGuard;

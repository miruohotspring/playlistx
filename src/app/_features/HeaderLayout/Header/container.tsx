import type { KeyboardEventHandler } from 'react';
import HeaderUI from './presentational';
import scGetClientId from '@serverActions/SC/scGetClientId';

const Header = ({
  handleSidebarOpen,
}: {
  handleSidebarOpen: () => void;
}) => {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
      await scGetClientId();
    }
  };
  return (
    <>
      <HeaderUI
        handleSidebarOpen={handleSidebarOpen}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

export default Header;

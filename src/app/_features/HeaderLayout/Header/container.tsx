import type { KeyboardEventHandler } from 'react';
import HeaderUI from './presentational';
import { useSc } from '@features/Providers/ScProvider';

const Header = ({
  handleSidebarOpen,
}: {
  handleSidebarOpen: () => void;
}) => {
  const { cid } = useSc();
  console.log(cid);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = async (e) => {
    if (e.key === 'Enter') {
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

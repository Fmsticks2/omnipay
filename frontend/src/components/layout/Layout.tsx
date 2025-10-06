import type { ReactNode } from 'react';
import type { FunctionComponent } from '../../common/types';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps): FunctionComponent => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#060011' }}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
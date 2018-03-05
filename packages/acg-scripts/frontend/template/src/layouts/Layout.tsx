import {
  DashboardLayout,
  doneProgress,
  initProgress,
  startProgress,
} from '@a-cloud-guru/react-ui-kit';
import { Icon } from 'antd';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';

import '../style.css';

initProgress();

Router.onRouteChangeStart = () => startProgress();
Router.onRouteChangeComplete = () => doneProgress();
Router.onRouteChangeError = () => doneProgress();

interface LayoutProps {
  pathname: string;
}

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

interface MenuLink {
  item: React.ReactNode;
  key: string;
}

class Layout extends React.Component<LayoutProps, {}> {
  menuItems: Array<MenuItem> = [
    { icon: <Icon type="team" />, text: 'Users', href: '/users' },
    {
      href: '/organizations',
      icon: <Icon type="global" />,
      text: 'Organizations',
    },
    {
      icon: <Icon type="shopping-cart" />,
      text: 'Products',
      href: '/products',
    },
    { icon: <Icon type="desktop" />, text: 'Content', href: '/content' },
  ];

  createLinks = (menuItems: Array<MenuItem>): Array<MenuLink> => {
    return menuItems.map(item => {
      return {
        item: (
          <Link href={item.href}>
            <a>
              {item.icon}
              <span>{item.text}</span>
            </a>
          </Link>
        ),
        key: item.href,
      };
    });
  };

  getSelectedItems = (
    items: Array<MenuItem>,
    pathname: string
  ): Array<string> => {
    return items.reduce((accumulator: Array<string>, item: MenuItem): Array<
      string
    > => {
      if (item.href === pathname) {
        accumulator.push(item.href);
      }
      return accumulator;
    }, []);
  };

  user = {
    avatar:
      'https://lh5.googleusercontent.com/-G8-1R9UAThw/AAAAAAAAAAI/AAAAAAAAABE/BlG3M_U7PXc/photo.jpg',
    name: 'John McKim',
  };

  render() {
    const { children, pathname } = this.props;
    return (
      <DashboardLayout
        selectedMenuItems={this.getSelectedItems(this.menuItems, pathname)}
        menuItems={this.createLinks(this.menuItems)}
        currentUser={this.user}
      >
        {children}
      </DashboardLayout>
    );
  }
}

export { Layout };

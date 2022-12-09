import Router from 'next/router';
import React from 'react';
import { UserContext } from '@context/UserContext';

import type { User, UserRole } from '@backend/models/User';

const adminRoles: UserRole[] = ['super', 'admin'];

/**
 * Check if user is Admin
 */
export function isAdmin(user: User) {
  return user && adminRoles.indexOf(user.role) > -1;
}

export default function withAuth(
  Component,
  {
    loginRequired = true,
    logoutRequired = false,
    adminRequired = false,
  }: {
    loginRequired?: boolean;
    logoutRequired?: boolean;
    adminRequired?: boolean;
  } = {},
) {
  class WithAuth extends React.Component {
    static contextType = UserContext;

    public static async getInitialProps(ctx) {
      const { req } = ctx;

      let pageComponentProps = {};

      if (Component.getInitialProps) {
        pageComponentProps = await Component.getInitialProps(ctx);
      }

      return {
        ...pageComponentProps,
        isServer: !!req,
      };
    }

    public componentDidMount() {
      // console.log('WithAuth.componentDidMount');

      const { currentUser: user } = this.context;

      if (loginRequired && !logoutRequired && !user) {
        return Router.push('/login');
      }

      if (adminRequired && !isAdmin(user)) {
        return Router.push('/403');
      }

      let redirectUrl = '/login';
      if (user) {
        if (isAdmin(user)) {
          redirectUrl = '/admin/home';
        } else {
          redirectUrl = '/retailer/home';
        }
      }

      if (logoutRequired && user) {
        console.log('here');
        Router.push(redirectUrl);
      }
    }

    public render() {
      const { currentUser: user } = this.context;

      if (loginRequired && !logoutRequired && !user) {
        return null;
      }

      if (adminRequired && !isAdmin(user)) {
        return null;
      }

      if (logoutRequired && user) {
        return null;
      }

      return <Component {...this.props} />;
    }
  }

  return WithAuth;
}

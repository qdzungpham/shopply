import {
  Flex,
  useBreakpointValue,
  Box,
  Container,
  ContainerProps,
  Stack,
  Text,
  HStack,
  Button,
  Progress,
  ButtonGroup,
  IconButton,
} from '@chakra-ui/react';
import Head from 'next/head';
import React, { useMemo } from 'react';
import { FiCalendar, FiHome, FiRotateCcw, FiShoppingBag, FiSearch } from 'react-icons/fi';

import { SidebarWrapper, NavButton } from '@components/common/sidebar';
import { Navbar } from '@components/common/navbar';
import { SiteSwitcher } from '@components/common/sidebar';
import { useAppContext } from '@context/AppContext';
import { ColorModeToggle } from '@components/common/color-mode-toggle';
import { CartNavbarIcon } from '@components/retailer/cart/cart-navbar-icon';
import { CartProvider } from '@context/CartContext';

export interface RetailerLayoutProps {
  children: React.ReactNode;
  bodyProps?: ContainerProps;
  pageTitle: string;
}

export const RetailerLayout = (props: RetailerLayoutProps) => {
  const { children, pageTitle, bodyProps } = props;
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <CartProvider>
      <Head>
        <title>{`${pageTitle}`}</title>
      </Head>
      <Flex
        as="section"
        direction={{ base: 'column', lg: 'row' }}
        height="100vh"
        bg="bg-canvas"
        overflowY="auto"
      >
        {isDesktop && <RetailerSidebar />}

        <Box flex="1" overflow="auto">
          <Navbar
            isDesktop={isDesktop}
            sidebar={<RetailerSidebar />}
            rightElements={
              <ButtonGroup variant="ghost" spacing="1">
                <IconButton fontSize="lg" icon={<FiSearch />} aria-label="Search" />
                <CartNavbarIcon />
                <ColorModeToggle />
              </ButtonGroup>
            }
          />
          <Container p={{ base: 4, md: 6 }} {...bodyProps}>
            {children}
          </Container>
        </Box>
      </Flex>
    </CartProvider>
  );
};

const RetailerSidebar = () => {
  const { categories } = useAppContext();

  const menu = useMemo(
    () => [
      {
        label: 'Home',
        path: '/retailer/home',
        icon: FiHome,
      },
      {
        label: 'Products',
        path: '/retailer/products',
        icon: FiShoppingBag,
        childMenu: categories.map((category) => ({
          label: category.name,
          path: `/retailer/products/${category.slug}`,
        })),
      },
      {
        label: 'Orders',
        path: '/retailer/orders',
        icon: FiCalendar,
      },
      {
        label: 'History',
        path: '/retailer/history',
        icon: FiRotateCcw,
      },
    ],
    [categories],
  );

  return (
    <SidebarWrapper>
      <Stack justify="space-between" spacing="1">
        <Stack spacing={{ base: '5', sm: '6' }} shouldWrapChildren>
          {/* <Logo /> */}
          <SiteSwitcher />
          <Stack spacing="1">
            {menu.map((menuItem) => (
              <NavButton key={menuItem.path} {...menuItem} />
            ))}
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', sm: '6' }}>
          <Box bg="bg-subtle" px="4" py="5" borderRadius="lg">
            <Stack spacing="4">
              <Stack spacing="1">
                <Text fontSize="sm" fontWeight="medium">
                  Almost there
                </Text>
                <Text fontSize="sm" color="muted">
                  Fill in some more information about you and your person.
                </Text>
              </Stack>
              <Progress value={80} size="sm" aria-label="Profile Update Progress" />
              <HStack spacing="3">
                <Button variant="link" size="sm">
                  Dismiss
                </Button>
                <Button variant="link" size="sm" colorScheme="blue">
                  Update profile
                </Button>
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </SidebarWrapper>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { HStack, Button, Tag, IconButton } from '@chakra-ui/react';
import Router from 'next/router';
import { FiEdit, FiEye } from 'react-icons/fi';

import withAuth from '@lib/withAuth';
import { AdminLayout } from '@components/layout/admin';
import { Card, CardHeader, CardTitle } from '@components/common/card';
import { SearchInput } from '@components/common/search-input';
import { DataGrid, ColumnDef } from '@components/common/data-grid';
import { adminGetRetailersApiMethod } from '@lib/api';
import { Retailer } from '@shared/types';
import { message } from '@lib/message';
import { useUserContext } from '@context/UserContext';

const Page = () => {
  const [sites, setSites] = useState<Retailer[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setIsFetching(true);
    adminGetRetailersApiMethod()
      .then((result) => {
        setSites(result);
        setIsFetching(false);
      })
      .catch((err) => {
        message.error(err.message);
        setIsFetching(false);
      });
  }, []);

  const { setActiveRetailerId } = useUserContext();

  const columns: ColumnDef<Retailer>[] = useMemo(
    () => [
      {
        id: 'tradingName',
        header: 'Name',
      },
      {
        id: 'emailAddress',
        header: 'Email',
      },
      {
        id: 'phoneNumber',
        header: 'Phone',
      },
      {
        id: 'status',
        header: 'Status',
        cell: (cellProps) => <Tag colorScheme="green">{cellProps.getValue<string>()}</Tag>,
      },
      {
        id: 'actions',
        header: null,
        cell: (cellProps) => (
          <HStack>
            <IconButton aria-label="Update retailer" size="xs" icon={<FiEdit />} />
            <IconButton
              aria-label="View as Retailer"
              size="xs"
              icon={<FiEye />}
              onClick={() => {
                setActiveRetailerId(cellProps.row.original._id);
                Router.push('/retailer/home');
              }}
            />
          </HStack>
        ),
      },
    ],
    [],
  );

  return (
    <AdminLayout pageTitle="Retailers">
      <Card>
        <CardHeader>
          <CardTitle flex={1}>Retailers</CardTitle>
          <HStack>
            <SearchInput />

            <Button variant="primary" onClick={() => Router.push('/admin/retailers/add')}>
              Add retailer
            </Button>
          </HStack>
        </CardHeader>
        <DataGrid
          columns={columns}
          data={sites}
          isSortable
          isLoading={isFetching}
          onSelectedRowsChange={(rows) => console.log(rows)}
        />
      </Card>
    </AdminLayout>
  );
};

export default withAuth(Page, { loginRequired: true, adminRequired: true });

import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { useState } from 'react';

import { planckBnToUnit } from '@/utils/functions';

import { Address, Link } from '@/components/Elements';

import { SUBSCAN_URL } from '@/consts';
import { useCoretimeApi } from '@/contexts/apis';
import { useNetwork } from '@/contexts/network';
import { PurchaseHistoryItem } from '@/models';

import { StyledTableCell, StyledTableRow } from '../common';

interface PurchaseHistoryTableProps {
  data: PurchaseHistoryItem[];
}

export const PurchaseHistoryTable = ({ data }: PurchaseHistoryTableProps) => {
  TimeAgo.addLocale(en);
  // Create formatter (English).
  const timeAgo = new TimeAgo('en-US');

  const { network } = useNetwork();
  const {
    state: { symbol, decimals },
  } = useCoretimeApi();

  // table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Stack direction='column' gap='1em'>
      <TableContainer component={Paper} sx={{ height: '35rem' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>Extrinsic Id</StyledTableCell>
              <StyledTableCell>Account</StyledTableCell>
              <StyledTableCell>Core</StyledTableCell>
              <StyledTableCell>{`Price (${symbol})`}</StyledTableCell>
              <StyledTableCell>Sales Type</StyledTableCell>
              <StyledTableCell>Timestamp</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(
              (
                { address, core, extrinsic_index, timestamp, price, type },
                index
              ) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    <Link
                      href={`${SUBSCAN_URL[network]}/extrinsic/${extrinsic_index}`}
                      target='_blank'
                    >
                      {extrinsic_index}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Link
                      href={`${SUBSCAN_URL[network]}/account/${address}`}
                      target='_blank'
                    >
                      <Address
                        value={address}
                        isCopy={true}
                        isShort={true}
                        size={24}
                      />
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align='right'>{core}</StyledTableCell>
                  <StyledTableCell align='right'>
                    {planckBnToUnit(price.toString(), decimals)}
                  </StyledTableCell>
                  <StyledTableCell>{type}</StyledTableCell>
                  <StyledTableCell>
                    {timeAgo.format(timestamp * 1000, 'round-minute')}
                  </StyledTableCell>
                </StyledTableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack alignItems='center'>
        <TableFooter sx={{ alignItems: 'center' }}>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Stack>
    </Stack>
  );
};

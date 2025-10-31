import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Input,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
} from '@mui/material';

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    dateRange: 'Last 30 days',
    status: 'All',
    mobile: '',
  });

  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: spins } = useQuery({
    queryKey: ['/api/admin/spins', filters],
  });

  const handleSearch = () => {
    // Trigger refetch with current filters
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #7c3aed, #2563eb, #14b8a6)' }}>
      <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <Box sx={{ maxWidth: 1280, margin: '0 auto', px: 2, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: '#fff' }}>⚙️</Avatar>
            <Typography variant="h5" color="white">Admin Dashboard</Typography>
          </Box>
          <Button variant="outlined" sx={{ color: 'white', borderColor: 'white' }} href="/">
            🎮 Back to Game
          </Button>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1280, margin: '0 auto', px: 2, py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 6 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main">{stats?.totalSpins || 0}</Typography>
              <Typography variant="body2" color="textSecondary">Total Spins</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">{stats?.totalWins || 0}</Typography>
              <Typography variant="body2" color="textSecondary">Total Wins</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="secondary.main">{stats?.winRate || 0}%</Typography>
              <Typography variant="body2" color="textSecondary">Win Rate</Typography>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ mb: 6 }}>
          <CardHeader title="Customer Spin Reports" />
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  label="Date Range"
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateRange: e.target.value }))}
                >
                  <MenuItem value="Last 7 days">Last 7 days</MenuItem>
                  <MenuItem value="Last 30 days">Last 30 days</MenuItem>
                  <MenuItem value="Last 90 days">Last 90 days</MenuItem>
                  <MenuItem value="All time">All time</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Winners">Winners</MenuItem>
                  <MenuItem value="Losers">Losers</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <Input
                  placeholder="Enter mobile number"
                  value={filters.mobile}
                  onChange={(e) => setFilters((prev) => ({ ...prev, mobile: e.target.value }))}
                />
              </FormControl>

              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button variant="contained" color="primary" fullWidth onClick={handleSearch}>
                  🔍 Search
                </Button>
              </Box>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Spin Date</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Prize</TableCell>
                  <TableCell>Attempt</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {spins?.map((spin) => (
                  <TableRow key={spin.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{spin.customerInitials}</Avatar>
                        <Box sx={{ ml: 2 }}>{spin.customerName || 'Unknown'}</Box>
                      </Box>
                    </TableCell>
                    <TableCell>+91 {spin.mobile}</TableCell>
                    <TableCell>{new Date(spin.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: 1,
                          py: 0.5,
                          borderRadius: 2,
                          backgroundColor: spin.isWinner ? 'success.main' : 'grey.500',
                          color: '#fff',
                        }}
                      >
                        {spin.isWinner ? '🏆 Winner' : '❌ No Prize'}
                      </Typography>
                    </TableCell>
                    <TableCell>{spin.prizeName || '-'}</TableCell>
                    <TableCell>{spin.attemptNumber}/2</TableCell>
                  </TableRow>
                ))}
                {(!spins || spins.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No spin records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
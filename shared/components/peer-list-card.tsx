'use client';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  TableHeader,
  TableHead,
  TableRow,
  Table,
  TableBody,
} from '@/shared/components/ui';
import { LoadingBounce } from './loading-bounce';
import { CreateVpn } from './@modals';
import { PeerItem } from './peer-item';
import { usePeerStore } from '../store/peer';
interface Props {
  className?: string;
}

export const PeerListCard: React.FC<Props> = () => {
  const peers = usePeerStore((state) => state.peers);
  const getPeers = usePeerStore((state) => state.getPeers);
  const loading = usePeerStore((state) => state.loading);

  React.useEffect(() => {
    getPeers();
  }, []);

  console.log(peers);
  return (
    <Card className='relative rounded-2xl shadow min-h-[160px]'>
      {loading ? (
        <LoadingBounce />
      ) : (
        <>
          <CardHeader>
            <CardTitle>Конфигурация WireGuard</CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            {peers?.length === 0 ? (
              <div>нету</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название конфига</TableHead>
                    <TableHead>Статус</TableHead>

                    <TableHead className='text-right'>Действия</TableHead>
                    <TableHead className='text-right'>Вкл/выкл</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {peers?.map((peer) => (
                    <PeerItem
                      key={peer.id}
                      name={peer.peerName}
                      status={peer.status}
                      id={peer.id}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
            <div className='flex justify-center mt-8'>
              <CreateVpn />
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};

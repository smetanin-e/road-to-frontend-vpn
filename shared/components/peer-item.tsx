import React from 'react';
import { Button, TableRow, TableCell, Badge, Switch } from '@/shared/components/ui';
import { WgPeerStatus } from '@prisma/client';
import axios from 'axios';
import { activatePeer, deactivatePeer } from '../services/peer';
import toast from 'react-hot-toast';
interface Props {
  className?: string;
  name: string;
  status: WgPeerStatus;
  id: number;
}

export const PeerItem: React.FC<Props> = ({ id, name, status }) => {
  const [loading, setLoading] = React.useState(false);
  const [statusPeer, setStatusPeer] = React.useState<WgPeerStatus>(status);

  const downloadConfig = async (peerId: number, peerName: string) => {
    try {
      const res = await axios.get(`/api/vpn/${peerId}/config`, {
        responseType: 'blob', // важно, чтобы axios воспринимал ответ как файл
        withCredentials: true, // чтобы cookie для авторизации передались
      });

      // создаём ссылку и скачиваем файл
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${peerName}.conf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании конфига:', error);
      alert('Не удалось скачать конфиг');
    }
  };

  const toggleStatus = async () => {
    try {
      setLoading(true);
      if (statusPeer === WgPeerStatus.ACTIVE) {
        await deactivatePeer(id);
        setStatusPeer(WgPeerStatus.INACTIVE);
        toast.success('Конфиг отключен');
      } else {
        await activatePeer(id);
        setStatusPeer(WgPeerStatus.ACTIVE);
        toast.success('Конфиг активирован');
      }
    } catch (error) {
      console.error('Failed to toggle peer status', error);
      toast.error('Не удалось изменить статус конфигурации. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Badge variant={status === WgPeerStatus.ACTIVE ? 'success' : 'destructive'}>
          {' '}
          {status === WgPeerStatus.ACTIVE ? 'Активен' : 'Отключен'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className='flex gap-2 justify-end'>
          <Button size={'sm'} variant='outline' onClick={() => downloadConfig(id, name)}>
            Скачать {}.conf
          </Button>
          <Button size={'sm'} variant='outline'>
            Показать QR-код
          </Button>
        </div>
      </TableCell>
      <TableCell className='text-right space-x-4'>
        <Switch
          checked={status === WgPeerStatus.ACTIVE}
          onCheckedChange={toggleStatus}
          disabled={loading}
          className='data-[state=checked]:bg-success data-[state=unchecked]:bg-gray-400'
        />
      </TableCell>
    </TableRow>
  );
};

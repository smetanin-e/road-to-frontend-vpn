import axios from 'axios';
import React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '../ui';
import { QrCode } from 'lucide-react';
import Image from 'next/image';

interface Props {
  peerId: number;
  peerName: string;
}

export const Qr: React.FC<Props> = ({ peerId, peerName }: Props) => {
  const [qrUrl, setQrUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchQr = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/vpn/${peerId}/config/qr`, {
        responseType: 'blob',
        withCredentials: true,
      });

      const url = URL.createObjectURL(res.data);
      setQrUrl(url);
    } catch (err) {
      console.error('Ошибка при загрузке QR:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant='outline' onClick={fetchQr} disabled={loading}>
          {loading ? <Spinner className='w-4 h-4' /> : <QrCode className='w-4 h-4' />}
        </Button>
      </DialogTrigger>

      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>QR-код для {peerName}</DialogTitle>
        </DialogHeader>

        {qrUrl ? (
          <div className='flex flex-col items-center gap-3'>
            <Image
              src={qrUrl}
              alt={`QR для ${peerName}`}
              width={250}
              height={250}
              className='rounded-lg border shadow-md'
            />
            <p className='text-sm text-muted-foreground text-center'>
              Отсканируй этот QR-код в приложении WireGuard
            </p>
          </div>
        ) : (
          <p className='text-center text-sm text-muted-foreground'>Загрузка QR-кода...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

import React from 'react';
import toast from 'react-hot-toast';
import { deletePeer } from '../services/peer';
import { Button, Popover, PopoverContent, PopoverTrigger, Spinner } from './ui';
import { Check, Trash2, TriangleAlert, X } from 'lucide-react';
interface Props {
  className?: string;
  id: number;
}

export const DeletePeer: React.FC<Props> = ({ id }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const removePeer = async (id: number) => {
    try {
      setLoading(true);
      setOpen(false);
      await deletePeer(id);
      toast.success('Конфигурационный файл удален', {
        icon: '✅',
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Ошибка удаления');
      setLoading(false);
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className='flex items-center justify-center relative'>
          <Button size={'icon'} variant='outline'>
            {loading ? <Spinner /> : <Trash2 className='w-4 h-4' />}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent align='end'>
        <div className='flex items-center gap-3 pb-2 text-sm'>
          {' '}
          <TriangleAlert size={50} color='orange' />
          Удалить конфигурацию!
        </div>
        <div className='flex gap-3 justify-center'>
          <Button variant='outline' size='sm' onClick={() => removePeer(id)}>
            <Check />
            Подтвердить
          </Button>
          <Button variant='outline' size='sm' onClick={() => setOpen(false)}>
            <X />
            Отмена
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

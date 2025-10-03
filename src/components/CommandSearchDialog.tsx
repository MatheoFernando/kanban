import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { getBoards } from '../lib/boards';
import { useTranslation } from 'react-i18next';

export function CommandSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [boards, setBoards] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    if (open) {
      setBoards(getBoards());
    }
  }, [open]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredBoards = normalizedQuery ? boards.filter(b => b.name.toLowerCase().includes(normalizedQuery)) : boards.slice(0, 8);


  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t('searchDialog.placeholder')} value={query} onValueChange={setQuery} />
      <CommandList>
        <CommandEmpty>{t('searchDialog.nothingFound')}</CommandEmpty>
        <CommandGroup heading={t('searchDialog.boardsHeading')}>
          {filteredBoards.map((b) => (
            <CommandItem key={b.id} onSelect={() => { onOpenChange(false); navigate(`/boards/${b.id}`) }}>
              {b.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
       
      </CommandList>
    </CommandDialog>
  );
}
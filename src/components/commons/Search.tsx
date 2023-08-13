import React, { useEffect, useState, MouseEvent } from 'react';

interface ElementToSearch {
  onListChange: (list: string[]) => void;
  initialList?: string[]
}

export const Search: React.FC<ElementToSearch> = ({ onListChange, initialList = [] }) => {
  const [searchInput, setSearchInput] = useState('');
  const [list, setList] = useState<string[]>(initialList);

  const add = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setList([...list, searchInput]);
    setSearchInput('');
  };

  const remove = (index: number) => {
    const newList = [...list];
    newList.splice(index, 1);
    setList(newList);
  };

  useEffect(() => {
    onListChange(list);
  }, [list, onListChange]);

  return (
    <div>
      <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
      <button onClick={(e: MouseEvent<HTMLButtonElement>) => add(e)}>Ajouter</button>
        {list.map((item, index) => (
            <p key={index}>{item} <span onClick={() => remove(index)}> x</span></p>
        ))}
    </div>
  );
};


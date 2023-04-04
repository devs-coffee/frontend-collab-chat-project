import {  MouseEvent } from 'react';
type elementToSearch = {
    searchElements: any[],
    title: string,
    sendData: (element: string) => void,
    remove: (element: string) => void
}



function Search({ searchElements, title, sendData, remove } : elementToSearch) {
    const create = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const element = document.querySelector(".tag") as HTMLInputElement;
        if(element && element.value.trim() !== ''){
            let value = element.value;
            sendData(value);
            element.value = '';
        }
    }

    const removeItem = (value: string) => {
        remove(value);
    }

    return (
        <div>
            <div>
                <p>{title}</p>
                <input placeholder='Entrer une catégorie' type="text" className="tag"/>
                <button onClick={(e: MouseEvent<HTMLButtonElement>) => create(e)}>Ajouter</button>
            </div>
            <div>
                {searchElements && searchElements.map((element, key) => {
                    return <p key={key} id={element}>{element}<span onClick={() => removeItem(element)}> x</span></p>
                })}
            </div>
        </div>
    );
}

export default Search;

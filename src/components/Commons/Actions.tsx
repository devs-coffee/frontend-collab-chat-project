import { useState } from "react";

import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import "./Actions.scss";

type actionsTypes = {
    availableActions: Array<'Annuler' | "Modifier" | "Supprimer">,
    actionHandler: (element: string) => void
    isShow?: boolean;
}

export const Actions = ({ availableActions, actionHandler, isShow = false }: actionsTypes) => {
    const [isShown, setIsShown] = useState(isShow);

    const triggerAction = (action: string) => {
        if (action === "Annuler") { setIsShown(false); }
        actionHandler(action)
    }
    const actionWithIcon = (action: string) => {
        switch (action) {
            case "Annuler":
                return "🗙 Annuler";
            case "Modifier":
                return "✎ Modifier";
            case "Supprimer":
                return "🗙 Supprimer";
            default:
                return action;
        }
    }
    return (
        <div className="actions">
            <div onClick={() => setIsShown(!isShown)} >
                <MoreHorizIcon />
            </div>
            {isShown &&
                availableActions && availableActions.map((action, index) =>
                    <ul>
                        <li key={`${action}_${index}`} onClick={() => triggerAction(action)}>{actionWithIcon(action)}</li>
                    </ul>
                )}
        </div>
    );
}


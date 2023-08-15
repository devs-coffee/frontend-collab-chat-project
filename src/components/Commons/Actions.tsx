import { useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import "./Actions.scss";

type actionsTypes = {
    availableActions: string[],
    actionHandler: (element: string) => void
}

export const Actions = ({ availableActions, actionHandler }: actionsTypes) => {
    const [isShown, setIsShown] = useState(false);

    const triggerAction = (action: string) => {
        actionHandler(action)
    }
    const actionWithIcon = (action: string) => {
        switch (action) {
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


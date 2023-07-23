import { useState } from "react";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

type actionsTypes = {
    availableActions : string[],
    actionHandler: (element: string) => void
}

const Actions = ({ availableActions, actionHandler }: actionsTypes) => {
    const [isShown, setIsShown] = useState(false);

    const triggerAction = (action: string) => {
        actionHandler(action)
    }

  return (
      <div className="actions">
        <div onClick={() => setIsShown(!isShown)}>
            <MoreHorizIcon />
        </div>
        {isShown && 
            availableActions && availableActions.map((action, index) => 
            <ul>
                <li key={`${action}_${index}`} onClick={() => triggerAction(action)}>{action}</li>
            </ul>
        )}
      </div>
  );
}

export default Actions;

import { ReactNode } from "react";

type ProtectedContentProps = {
    children: ReactNode;
};


const ProtectedContent = ({ children } : ProtectedContentProps) => {
    return <div>{children}</div> ;
}



export default ProtectedContent;
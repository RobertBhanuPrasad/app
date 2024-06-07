import { X } from "lucide-react";
import { FC, MouseEventHandler } from "react";

interface ErrorAlertsProps {
    title : String;
    description : String;
    onClose : ()=>void;
}

const ErrorAlerts : FC<ErrorAlertsProps> = ({title,description,onClose}) => {
    return (
        <div className="mx-5 alert alert-danger alert-dismissible fade show d-flex justify-content-between align-items-center" role="alert">
        {title}<br />{description}
        <button type="button" className="btn-lg px-2 h-7 rounded-lg" aria-label="Close" onClick={onClose}>
          <X />
        </button>
      </div>
    )
}

export default ErrorAlerts
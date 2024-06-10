import { AlertCircle, X } from "lucide-react";
import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "src/ui/alert";

interface ErrorAlertsProps {
  title: String;
  description: String;
  onClose: () => void;
}

const ErrorAlerts: FC<ErrorAlertsProps> = ({ title, description, onClose }) => {
  return (
    <div className="px-4">
    <Alert className="alert alert-danger py-1 my-2 d-flex flex-column " >
      <AlertTitle >
        <AlertCircle className="mb-2" /> {title}
      </AlertTitle>
      <AlertDescription className="d-flex justify-content-between align-items-center">
        {description}
        <button type="button" className="btn-lg px-2 h-7 position-relative bottom-6 " aria-label="Close" onClick={onClose}>
        <X />
        </button>
      </AlertDescription>
    </Alert>
    </div>
  )
}

export default ErrorAlerts
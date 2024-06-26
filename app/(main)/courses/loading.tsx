
import { Loader } from "lucide-react";

const Loading = () => {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
        </div>
    );
};

export default Loading;
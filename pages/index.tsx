import { Button } from "src/ui/button";
import useGetLanguageCode, { loadLanguageModule } from "src/utility/useGetLanguageCode";

export default function Index() {
  loadLanguageModule(useGetLanguageCode())
  return (
    <div className="text-3xl">
      <Button>Hello</Button>
    </div>
  );
}

Index.noLayout = false;
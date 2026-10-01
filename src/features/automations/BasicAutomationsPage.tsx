import { useState } from "react";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@/icons/Icon";
import { ShellPage } from "@/shell/ShellPage";
import { AutomationsTable } from "./basic/AutomationsTable";
import { TemplatePicker } from "./basic/TemplatePicker";

/** /automations/basic-automations: heading, "New automation" template sheet, searchable table. */
export default function BasicAutomationsPage() {
  const [query, setQuery] = useState("");
  return (
    <ShellPage breadcrumb={[{ label: "Automations" }, { label: "Basic Automations" }]}>
      <div className="flex justify-between pb-7">
        <h1 className="text-2xl font-medium">Basic Automations</h1>
        <div className="flex gap-x-4">
          {/* The real button opens help.zaapi.com, outside the demo. */}
          <Inert className={buttonClass("outline")}>
            <Icon name="lightbulb-on" variant="fal" className="w-4 h-4" />
            Tutorial
          </Inert>
          <Dialog>
            <DialogTrigger className={buttonClass()}>
              <Icon name="plus" variant="far" className="h-4 w-4" />
              New automation
            </DialogTrigger>
            <TemplatePicker />
          </Dialog>
        </div>
      </div>
      <div className="text-gray-500 text-sm mt-[-14px] mb-6">
        Save time and engage customers with automated responses, assignment, chatbot and more.
      </div>
      <section className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg text-light-black">All automations</h2>
        </div>
        <div className="w-1/2">
          <div className="text-sm flex relative items-center flex-row-reverse h-9 w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-1 ml-2">
              <Icon name="magnifying-glass" variant="far" className="size-4 text-gray-400" />
            </div>
            <input
              aria-label="Search automation names"
              className="border-gray-200 placeholder-gray-400 outline-hidden focus:border-gray-300 inline h-full w-full rounded-md border bg-white pr-9 pl-9"
              placeholder="Search automation names"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <AutomationsTable query={query} />
      </section>
    </ShellPage>
  );
}

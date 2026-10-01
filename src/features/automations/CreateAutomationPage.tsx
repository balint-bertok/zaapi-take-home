import { ShellPage } from "@/shell/ShellPage";

/** Placeholder until the feature PR builds this page. */
export default function CreateAutomationPage() {
  return <ShellPage
      section="automations"
      breadcrumb={[
        { label: "Automations", to: "/automations/basic-automations" },
        { label: "Basic Automations", to: "/automations/basic-automations" },
        { label: "Create automation" },
      ]}
    />;
}

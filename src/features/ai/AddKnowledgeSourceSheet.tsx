import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Inert } from "@/components/Inert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { updateDemo, useDemo } from "@/store/store";
import type { KnowledgeSourceType } from "./fixtures";
import { stamp } from "./format";
import { Counter, FormCard, IntegrationPicker, Rich, RadioCard, RichTextEditor, SheetFooter } from "./parts";

type Kind = Exclude<KnowledgeSourceType, "quickReplies">;

// ai.knowledgeSource.addNewDialog.* and ai.knowledgeSource.manualInput.description, verbatim.
const options: { kind: Kind; label: string }[] = [
  { kind: "file", label: "Upload File" },
  { kind: "website", label: "Add Website" },
  { kind: "manual_input", label: "Write it yourself" },
];
const webDisclaimer =
  "<b>Note:</b> Do not upload Shopee, Lazada, or similar links.\n\n<b>How the crawler works</b>\nThe crawler will scan up to <b>3 levels deep</b> and <b>100 pages max</b>, starting from the URL you enter. It will only visit pages that <b>begin with that URL</b>.\n\n<b>Example:</b>\nIf you enter https://zaapi.com, the crawler will scan:\n- https://zaapi.com (level 0)\n- https://zaapi.com/features (level 1)\n- https://zaapi.com/features/analytics (level 2)\n- ...up to 3 levels deep.";
const manualInputDescription =
  "Write anything you want the AI to learn about your business to improve its response accuracy.\n\n<b>Tip</b>: For best results, organize the text using proper headings (like H1, H2) and paragraphs.";

const link = "text-electric-green-600 font-medium hover:text-electric-green-700";
// The file input's `accept` list as a test on dropped names, which `accept` does not cover.
const accepted = /\.(txt|csv|docx|xlsx)$/i;

/** "Add New Knowledge Source" sheet (Step 9 (2)). Adding appends a row to the store; nothing is uploaded. */
export function AddKnowledgeSourceSheet({ onDone }: { onDone: () => void }) {
  return (
    <SheetContent title="Add New Knowledge Source">
      {/* Inside the content, so the form state resets every time the sheet closes. */}
      <KnowledgeSourceForm onDone={onDone} />
    </SheetContent>
  );
}

function KnowledgeSourceForm({ onDone }: { onDone: () => void }) {
  const user = useDemo((s) => s.user);
  const [name, setName] = useState("");
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [kind, setKind] = useState<Kind>("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const site = url.trim();
  // https://, then dot-separated non-empty host labels, then an optional path; no spaces anywhere.
  const urlInvalid = site !== "" && !/^https:\/\/[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/.test(site);
  const [text, setText] = useState("");
  const content = { file: file?.name ?? "", website: urlInvalid ? "" : site, manual_input: text.trim() }[kind];
  const ready = name.trim() !== "" && content !== "";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    updateDemo((s) => ({
      ...s,
      knowledgeSources: [
        ...s.knowledgeSources,
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          enabled: true,
          source: user.name,
          type: kind,
          detail: kind === "manual_input" ? name.trim() : content,
          integrations,
          characters: kind === "manual_input" ? content.length : null,
          createdAt: stamp(),
        },
      ],
    }));
    toast.success("Knowledge source successfully added");
    onDone();
  }

  return (
      <section className="flex flex-col gap-5 bg-gray-50 overflow-auto px-7 py-4 text-sm">
        <form className="space-y-5" onSubmit={submit}>
          <FormCard>
            <label htmlFor="source-name" className="text-base font-medium text-gray-800 mb-2">
              Source name
            </label>
            <Input
              id="source-name"
              className="mt-2 rounded-md"
              placeholder="Enter source name to identify it."
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Counter value={name} max={100} className="mt-0" />
          </FormCard>

          <FormCard className="space-y-3">
            <div className="space-y-1">
              <label className="text-base font-medium text-gray-800 mb-2">Where should AI use this source?</label>
              <p className="text-gray-500 whitespace-pre-line">Choose the integrations where this source will be active.</p>
            </div>
            <IntegrationPicker value={integrations} onChange={setIntegrations} />
          </FormCard>

          <FormCard>
            <h3 className="text-base font-medium text-gray-800">Select source type</h3>
            <div role="radiogroup" aria-label="Select source type" className="flex gap-4 mt-2 mb-7">
              {options.map((o) => (
                <RadioCard key={o.kind} checked={kind === o.kind} onSelect={() => setKind(o.kind)} className="hover:bg-white hover:border-gray-300 aria-checked:hover:border-electric-green-500">
                  {o.label}
                </RadioCard>
              ))}
            </div>

            <div className="space-y-4">
              {kind === "file" && (
                <>
                  <p className="text-gray-500 whitespace-pre-line">
                    To help AI find information better, keep your files well-organized. For Excel files, use the first row for headers and start your data from the second row.
                  </p>
                  {/* Template downloads point at files that were never captured. */}
                  <div className="flex gap-2">
                    <Inert className={link}>Download General Q&amp;A Template</Inert>
                    <div className="shrink-0 bg-gray-200 w-px h-4" />
                    <Inert className={link}>Download Product Details Template</Inert>
                  </div>
                  <div className="space-y-4">
                    <div
                      className="border border-dashed border-gray-200 hover:bg-gray-50 rounded-xl h-36 flex flex-col gap-2 justify-center items-center text-sm p-4"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        // One file of an accepted type, as the sheet states; any other drop is ignored.
                        const dropped = e.dataTransfer.files;
                        if (dropped.length === 1 && accepted.test(dropped[0].name)) setFile(dropped[0]);
                      }}
                    >
                      <div className="text-gray-800">{file ? file.name : "Drop file"}</div>
                      <div className="text-gray-400">or</div>
                      <div>
                        <Button variant="outline" onClick={() => fileInput.current?.click()}>
                          Choose file
                        </Button>
                      </div>
                      <input
                        ref={fileInput}
                        type="file"
                        hidden
                        accept=".txt,.csv,.docx,.xlsx"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  <p className="text-gray-500 whitespace-pre-line">You can only upload 1 file at a time, and we accept the following formats: .txt, .csv, .docx, and .xlsx.</p>
                </>
              )}
              {kind === "website" && (
                <>
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <label htmlFor="source-url" className="font-medium text-gray-800">
                        Website URL
                      </label>
                    </div>
                    <Input
                      id="source-url"
                      className="rounded-md"
                      placeholder="https://zaapi.com/features"
                      value={url}
                      aria-invalid={urlInvalid}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                    {urlInvalid && <p className="text-error-500">Invalid website URL. Please ensure it starts with 'https://'.</p>}
                  </div>
                  <p className="text-gray-400 whitespace-pre-line">
                    <Rich text={webDisclaimer} />
                  </p>
                </>
              )}
              {kind === "manual_input" && (
                <>
                  <p className="text-gray-500 whitespace-pre-line">
                    <Rich text={manualInputDescription} />
                  </p>
                  <RichTextEditor label="Knowledge source text" onText={setText} />
                </>
              )}
            </div>
          </FormCard>

          <SheetFooter onCancel={onDone} submitLabel="Add knowledge source" disabled={!ready} />
        </form>
      </section>
  );
}

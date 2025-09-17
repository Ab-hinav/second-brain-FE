"use client";


import * as React from "react";
import { useActionState } from "react";
import {
  Button,
  Card,
  CardBody,
  Input,
  Textarea,
  Switch,
  Chip,
  Spinner,
} from "@heroui/react";
import { CreateItemForBrain  } from "@/actions/items";
import { CreateItemState, INITIAL_STATE } from "@/types/brain";
import { useRouter } from "next/navigation";
import { prefillFromUrl } from "@/util/prefill";

type Props = {
  brainId: string;
  type: 'tweet'| 'video'| 'note'| 'link'|'other'|'youtube'
  redirectUrl: string; 
};

/** Client form for creating a new item (link/note/etc.) under a brain. */
export default function CreateItemForm({ brainId, type, redirectUrl }: Props) {
  const [state, formAction, pending] = useActionState<CreateItemState, FormData>(
    CreateItemForBrain as any,
    INITIAL_STATE
  );

  const router = useRouter();

  
  const [tagInput, setTagInput] = React.useState("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [url,setUrlInput] = React.useState("")
  const [title,setTitleInput] = React.useState("")
  const [content,setContentInput] = React.useState("")
  const [isOn,setIsOn] = React.useState(false);
  const [isPrefilling, setIsPrefilling] = React.useState(false);
  const lastPrefilledRef = React.useRef<string>("");

  /** Add a trimmed tag from the input if not duplicate. */
  function addTagFromInput() {
    const t = tagInput.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput("");
  }
  /** Remove a tag by value. */
  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t));
  }
  /** Keyboard UX for creating/removing tags inline. */
  function onTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addTagFromInput();
    }
    if (e.key === "Backspace" && !tagInput && tags.length) {
      e.preventDefault();
      setTags((prev) => prev.slice(0, -1));
    }
  }

  React.useEffect(() => {
    if (state.success && Object.keys(state.errors).length === 0) {
        console.log('hit on success????')
        setUrlInput("")
        setTitleInput("")
        setContentInput("")
        setTags([])
        setTagInput("")
      if (redirectUrl){
        router.push(redirectUrl)
      };
    }
  }, [state, redirectUrl]);


  /** Clear all fields and reset server action state. */
  const handleFormReset = ()=>{
    setUrlInput("")
    setTitleInput("")
    setContentInput("")
    setTags([])
    setTagInput("")
    React.startTransition(() => {
        // @ts-ignore
        formAction(null);
      });

  }


  /** Submit the form to the server action with derived fields. */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("brainId", brainId);
    formData.set("type", type);
    formData.set("tags", tags.join(","));
    formData.set("pinned",isOn+'');

    React.startTransition(() => {
      // @ts-ignore
      formAction(formData);      
      
    });

  }

  async function runPrefill(currentUrl: string) {
    const val = currentUrl.trim();
    if (!val || lastPrefilledRef.current === val) return;
    try {
      setIsPrefilling(true);
      const meta = await prefillFromUrl(val);
      console.log('meta',meta)
      // Only prefill if the user hasn't already typed values
      if (meta?.title && !title) setTitleInput(meta.title);
      if (meta?.description && !content) setContentInput(meta.description);
      lastPrefilledRef.current = val;
    } catch (e) {
      // no-op: network/CORS failures are ignored
    } finally {
      setIsPrefilling(false);
    }
  }

  // Debounced prefill when the URL looks ready (user pauses typing)
  React.useEffect(() => {
    if (!url || url.length < 8) return; // quick guard
    const t = setTimeout(() => runPrefill(url), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);


  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              name="url"
              label={`${type} URL`}
              placeholder="https://…"
              value={url}
              onChange={(e) => setUrlInput(e.target.value)}
              isDisabled={pending}
              isInvalid={!!state?.errors?.url}
              errorMessage={state?.errors?.url?.join(", ")}
              endContent={isPrefilling ? <Spinner size="sm" /> : null}
            />
            <Input
              name="title"
              label="Title"
              isRequired
              value={title}
              onChange={(e) => setTitleInput(e.target.value)}
              isDisabled={pending}
              isInvalid={!!state?.errors?.title}
              errorMessage={state?.errors?.title?.join(", ")}
            />
          </div>

          <Textarea
            name="content"
            label="Content / Notes"
            minRows={4}
            isDisabled={pending}
            value={content}
            onChange={(e) => setContentInput(e.target.value)}
            isInvalid={!!state?.errors?.content}
            errorMessage={state?.errors?.content?.join(", ")}
          />

          {/* Tags chip input */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md border p-2">
              {tags.map((t) => (
                <Chip key={t} onClose={() => removeTag(t)} variant="flat">
                  {t}
                </Chip>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={onTagKeyDown}
                onBlur={addTagFromInput}
                placeholder={tags.length ? "" : "Type and press Enter"}
                className="flex-1 min-w-[10ch] bg-transparent outline-none text-sm"
              />
            </div>
            {state?.errors?.tags?.length ? (
              <p className="text-xs text-danger mt-1">{state?.errors?.tags.join(", ")}</p>
            ) : null}
          </div>

          <div className="flex items-center justify-between">
            <Switch isSelected={isOn} onValueChange={setIsOn} name="pinned" value="on" isDisabled={pending} >
              Pinned
            </Switch>

            <div className="flex gap-2">
              <Button
                type="reset"
                variant="flat"
                onPress={() => {
                  setTagInput("");
                  setTags([]);
                  setUrlInput('')
                  setTitleInput('')
                  setContentInput('')
                  handleFormReset();
                }}
                isDisabled={pending}
              >
                Reset
              </Button>
              <Button color="secondary" type="submit" isLoading={pending}>
                Create
              </Button>
            </div>
          </div>

          {/* non-field errors */}
          {state?.errors?._form?.length ? (
            <p className="text-sm text-danger">{state?.errors?._form?.join(", ")}</p>
          ) : null}
        </form>
      </CardBody>
    </Card>
  );
}

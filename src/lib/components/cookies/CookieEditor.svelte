<script lang="ts">
  import { onMount } from "svelte";
  import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "$lib/components/ui/dialog";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import { ClipboardCopy, Undo2, Plus, Trash2, Save, RefreshCcw, PenIcon } from "@lucide/svelte";

  // Props
  export let cookieString: string = "";
  export let otherCookieMap: Map<string, string> = new Map();
  export let onSave: (cookieString: string) => void = () => {};

  // Internal state
  let open = false;
  let pairs: { key: string; value: string }[] = [];
  let initialPairs: { key: string; value: string }[] = [];
  let history: { key: string; value: string }[][] = [];
  let canUndo = false;
  let copyMsg: Record<string, string> = {};

  // Parse cookie string into pairs
  function parseCookie(str: string): { key: string; value: string }[] {
    return str
      .split(";")
      .map((pair) => pair.trim())
      .filter(Boolean)
      .map((pair) => {
        const [key, ...rest] = pair.split("=");
        return { key, value: rest.join("=") };
      })
      .filter(({ key }) => key.length > 0);
  }

  // Serialize pairs into cookie string
  function serializeCookie(pairs: { key: string; value: string }[]): string {
    return pairs
      .filter(({ key }) => key.trim().length > 0)
      .map(({ key, value }) => `${key}=${value}`)
      .join("; ");
  }

  // Open modal and initialize state
  function openEditor() {
    pairs = parseCookie(cookieString);
    initialPairs = JSON.parse(JSON.stringify(pairs));
    history = [];
    canUndo = false;
    open = true;
  }

  // Save changes
  function save() {
    const str = serializeCookie(pairs);
    onSave(str);
    open = false;
  }

  // Add new row
  function addPair() {
    pushHistory();
    pairs = [...pairs, { key: "", value: "" }];
  }

  // Remove row
  function removePair(idx: number) {
    pushHistory();
    pairs = pairs.filter((_, i) => i !== idx);
  }

  // Edit key/value
  function updatePair(idx: number, field: "key" | "value", val: string) {
    pushHistory();
    pairs = pairs.map((pair, i) =>
      i === idx ? { ...pair, [field]: val } : pair
    );
  }

  // Undo
  function undo() {
    if (history.length > 0) {
      pairs = history.pop()!;
      canUndo = history.length > 0;
    }
  }

  // Reset to initial
  function reset() {
    pushHistory();
    pairs = JSON.parse(JSON.stringify(initialPairs));
  }

  // Copy value from other cookie
  async function copyFromOther(idx: number, key: string) {
    if (otherCookieMap.has(key)) {
      pushHistory();
      pairs = pairs.map((pair, i) =>
        i === idx ? { ...pair, value: otherCookieMap.get(key) ?? "" } : pair
      );
      copyMsg[key] = "Copied!";
      setTimeout(() => (copyMsg[key] = ""), 1200);
    }
  }

  // Copy value to clipboard
  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      copyMsg[key] = "Copied!";
      setTimeout(() => (copyMsg[key] = ""), 1200);
    } catch {
      copyMsg[key] = "Failed!";
    }
  }

  // Push current state to history for undo
  function pushHistory() {
    history.push(JSON.parse(JSON.stringify(pairs)));
    canUndo = true;
    // Limit history size for memory
    if (history.length > 30) history.shift();
  }
</script>

<Dialog bind:open>
  <DialogTrigger >
    <slot name="trigger">
      <Button variant="ghost" onclick={openEditor}>
        <PenIcon />
      </Button>
    </slot>
  </DialogTrigger>
  <DialogContent class="max-w-2xl w-full p-0">
    <form on:submit|preventDefault={save}>
      <div class="p-6 space-y-4">
        <DialogTitle>Edit Cookie</DialogTitle>
        <DialogDescription>
          Edit, add, or remove key-value pairs. You can also copy values from the other cookie.
        </DialogDescription>
        <ScrollArea class="max-h-[50vh]">
          <table class="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th class="text-left px-2 py-1">Key</th>
                <th class="text-left px-2 py-1">Value</th>
                <th class="px-2 py-1"></th>
              </tr>
            </thead>
            <tbody>
              {#each pairs as pair, idx}
                <tr class="bg-muted rounded">
                  <td class="px-2 py-1">
                    <Input
                      class="w-full"
                      value={pair.key}
                      oninput={(e) => updatePair(idx, "key", e.target.value)}
                      placeholder="Key"
                    />
                  </td>
                  <td class="px-2 py-1 flex items-center gap-1">
                    <Input
                      class="w-full"
                      value={pair.value}
                      oninput={(e) => updatePair(idx, "value", e.target.value)}
                      placeholder="Value"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Copy value"
                      onclick={() => copyToClipboard(pair.value, `val-${idx}`)}
                    >
                      <ClipboardCopy size={15} />
                    </Button>
                    {#if otherCookieMap.has(pair.key)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title="Copy value from other cookie"
                        onclick={() => copyFromOther(idx, pair.key)}
                      >
                        <ClipboardCopy size={15} class="text-blue-600" />
                      </Button>
                    {/if}
                    {#if copyMsg[`val-${idx}`]}
                      <span class="text-xs text-green-600">{copyMsg[`val-${idx}`]}</span>
                    {/if}
                    {#if copyMsg[pair.key]}
                      <span class="text-xs text-blue-600">{copyMsg[pair.key]}</span>
                    {/if}
                  </td>
                  <td class="px-2 py-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      title="Remove"
                      onclick={() => removePair(idx)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </ScrollArea>
        <div class="flex gap-2">
          <Button type="button" variant="secondary" size="sm" onclick={addPair}>
            <Plus size={16} class="mr-1" /> Add Row
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onclick={undo}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo2 size={16} class="mr-1" /> Undo
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onclick={reset}
            title="Reset to original"
          >
            <RefreshCcw size={16} class="mr-1" /> Reset
          </Button>
        </div>
      </div>
      <DialogFooter class="flex justify-end gap-2 p-4 border-t bg-muted">
        <Button type="button" variant="ghost" onclick={() => (open = false)}>
          Cancel
        </Button>
        <Button type="submit" variant="default">
          <Save size={16} class="mr-1" /> Save
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

<style>
  th, td {
    vertical-align: middle;
  }
  tr.bg-muted {
    background: var(--muted);
  }
</style>

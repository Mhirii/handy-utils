<script lang="ts">
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "$lib/components/ui/card";
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "$lib/components/ui/table";
  import { ScrollArea } from "$lib/components/ui/scroll-area";
  import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "$lib/components/ui/dialog";
  import EntryModal from "../../../routes/cookies/entry-modal.svelte";
  import SingleEntryModal from "../../../routes/cookies/single-entry-modal.svelte";

  export let title: string;
  export let description: string;
  export let keys: string[] = [];
  export let type: "common" | "uniqueFirst" | "uniqueSecond" = "common";
  export let firstCookieMap: Map<string, string> = new Map();
  export let secondCookieMap: Map<string, string> = new Map();

  // For modal state
  let selectedKey = "";
  let firstCookieValue = "";
  let secondCookieValue = "";

  function handleCommonClick(key: string) {
    selectedKey = key;
    firstCookieValue = firstCookieMap.get(key) || "";
    secondCookieValue = secondCookieMap.get(key) || "";
  }
</script>

<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    <ScrollArea class="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {#each keys as key}
            <TableRow>
              <Dialog>
                <DialogTrigger
                  class="cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1 w-full"
                  onclick={() => {
                    if (type === "common") {
                      handleCommonClick(key);
                    } else {
                      selectedKey = key;
                    }
                  }}
                >
                  <TableCell class="w-full flex justify-between">
                    <p>{key}</p>
                  </TableCell>
                </DialogTrigger>
                <DialogContent
                  class="w-full min-w-[70vw] lg:min-w-[80vw] p-6 space-y-6 max-h-[80vh] overflow-y-auto"
                >
                  {#if type === "common"}
                    <EntryModal
                      {key}
                      {firstCookieValue}
                      {secondCookieValue}
                    />
                  {:else if type === "uniqueFirst"}
                    <SingleEntryModal
                      {key}
                      CookieValue={firstCookieMap.get(key)!}
                    />
                  {:else if type === "uniqueSecond"}
                    <SingleEntryModal
                      {key}
                      CookieValue={secondCookieMap.get(key)!}
                    />
                  {/if}
                </DialogContent>
              </Dialog>
            </TableRow>
          {/each}
        </TableBody>
      </Table>
    </ScrollArea>
  </CardContent>
</Card>

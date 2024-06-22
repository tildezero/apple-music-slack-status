// script.ts
import { run } from "https://deno.land/x/jxa_run/mod.ts";
import type {} from "https://deno.land/x/jxa_run/global.d.ts";

const track = await run(() => Application("Music").currentTrack().name())
const artist = await run(() => Application("Music").currentTrack().artist())
console.log(`currently listening to ${track} by ${artist}`)
// script.ts
import { run } from "https://deno.land/x/jxa_run@v0.0.3/mod.ts";
import type {} from "https://deno.land/x/jxa_run@v0.0.3/global.d.ts";
import type { iTunes } from "https://deno.land/x/jxa_run@v0.0.3/types/system-apps/ITunes.d.ts";
import { SlackAPI } from "https://deno.land/x/deno_slack_api@2.1.1/mod.ts";
import "https://deno.land/std/dotenv/load.ts"

const slack = SlackAPI(Deno.env.get('SLACK_TOKEN') as string)

async function getCurrentTrack() {
    return await run(() => {
        const music = Application("Music") as unknown as iTunes
        return {
            name: music.currentTrack().name(),
            artist: music.currentTrack().artist()
        }
    })
}

const currentTrack = await getCurrentTrack()

await slack.users.profile.set({
    profile: {
        status_text: `listening to ${currentTrack.name} by ${currentTrack.artist}`,
        status_emoji: ":applemusic:",
        status_expiration: 0
    }
})